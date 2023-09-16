"use strict";
const { Gio, GLib, St, Clutter, GObject } = imports.gi;
const Main = imports.ui.main;
const Keyboard = imports.ui.keyboard;
const Key = Keyboard.Key;
const PanelMenu = imports.ui.panelMenu;
const ExtensionUtils = imports.misc.extensionUtils;
const Me = ExtensionUtils.getCurrentExtension();

const A11Y_APPLICATIONS_SCHEMA = "org.gnome.desktop.a11y.applications";
const KEY_RELEASE_TIMEOUT = 100;

let _oskA11yApplicationsSettings;
let backup_lastDeviceIsTouchScreen;
let backup_relayout;
let backup_addRowKeys;
let backup_commitAction;
let backup_toggleDelete;
let backup_toggleModifier;
let backup_setActiveLayer;
let backup_touchMode;
let backup_getCurrentGroup;
let currentSeat;
let _indicator;
let settings;
let keyReleaseTimeoutId;

function isInUnlockDialogMode() {
  return Main.sessionMode.currentMode === 'unlock-dialog';
}

// Indicator
let OSKIndicator = GObject.registerClass(
  { GTypeName: "OSKIndicator" },
  class OSKIndicator extends PanelMenu.Button {
    _init() {
      super._init(0.0, `${Me.metadata.name} Indicator`, false);

      let icon = new St.Icon({
        icon_name: "input-keyboard-symbolic",
        style_class: "system-status-icon",
      });

      this.add_child(icon);

      this.connect("button-press-event", function (_actor, event) {
        let button = event.get_button();

        if (button == 1) {
          toggleOSK();
        }

        // Don't open extension prefs if in unlock-dialog session mode
        if (button == 3 && !isInUnlockDialogMode()) {
          ExtensionUtils.openPrefs();
        }
      });

      this.connect("touch-event", function () {
        toggleOSK();
      });
    }
  }
);

function toggleOSK() {
  if (Main.keyboard._keyboard._keyboardVisible) return Main.keyboard.close();

  Main.keyboard.open(Main.layoutManager.bottomIndex);
}

// Overrides
function override_lastDeviceIsTouchScreen() {
  if (!this._lastDevice) return false;

  let deviceType = this._lastDevice.get_device_type();

  return settings.get_boolean("ignore-touch-input")
    ? false
    : deviceType == Clutter.InputDeviceType.TOUCHSCREEN_DEVICE;
}

function override_relayout() {
  let monitor = Main.layoutManager.keyboardMonitor;

  if (!monitor) return;

  this.width = monitor.width;

  if (monitor.width > monitor.height) {
    this.height = (monitor.height * settings.get_int("landscape-height")) / 100;
  } else {
    this.height = (monitor.height * settings.get_int("portrait-height")) / 100;
  }
}

function override_addRowKeys(keys, layout) {
  for (let i = 0; i < keys.length; ++i) {
    const key = keys[i];
    const {strings} = key;
    const commitString = strings?.shift();

    let button = new Key({
      commitString,
      label: key.label,
      iconName: key.iconName,
      keyval: key.keyval,
    }, strings);

    if (key.width !== null)
      button.setWidth(key.width);

    if (key.action !== 'modifier') {
      button.connect('commit', (_actor, keyval, str) => {
        this._commitAction(keyval, str);
      });
    }

    if (key.action !== null) {
      button.connect('released', () => {
        if (key.action === 'hide') {
          this.close();
        } else if (key.action === 'languageMenu') {
          this._popupLanguageMenu(button);
        } else if (key.action === 'emoji') {
          this._toggleEmoji();
        } else if (key.action === 'modifier') {
          // Pass the whole key object to allow switching layers on "Shift" press
          this._toggleModifier(key);

        } else if (key.action === 'delete') {
          this._toggleDelete(true);
          this._toggleDelete(false);
        } else if (!this._longPressed && key.action === 'levelSwitch') {
          this._setActiveLayer(key.level);

          // Ensure numbers layer latches
          const isNumbersLayer = key.level === 2;
          this._setLatched(isNumbersLayer);
        }

        this._longPressed = false;
      });
    }

    if (key.iconName === 'keyboard-shift-symbolic') layout.shiftKeys.push(button);

    if (key.action === 'delete') {
      button.connect('long-press',
          () => this._toggleDelete(true));
    }

    if (key.action === 'modifier') {
      let modifierKeys = this._modifierKeys[key.keyval] || [];
      modifierKeys.push(button);
      this._modifierKeys[key.keyval] = modifierKeys;
    }

    if (key.action || key.keyval)
      button.keyButton.add_style_class_name('default-key');

    layout.appendKey(button, button.keyButton.keyWidth);
  }
}

async function override_commitAction(keyval, str) {
  if (this._modifiers.size === 0 && str !== '' &&
      keyval && this._oskCompletionEnabled) {
    if (await Main.inputMethod.handleVirtualKey(keyval))
      return;
  }

  if (str === '' || !Main.inputMethod.currentFocus ||
      (keyval && this._oskCompletionEnabled) ||
      this._modifiers.size > 0 ||
      !this._keyboardController.commitString(str, true)) {
    if (keyval !== 0) {
      // If sending a key combination with a string char, use lowercase key value,
      // otherwise extension can't reliably input "Shift + [key]" combinations
      // See https://github.com/nick-shmyrev/improved-osk-gnome-ext/issues/38#issuecomment-1466599579
      const keyvalToPress = str === '' ? keyval : Key.prototype._getKeyvalFromString(str.toLowerCase());

      this._forwardModifiers(this._modifiers, Clutter.EventType.KEY_PRESS);
      this._keyboardController.keyvalPress(keyvalToPress);
      keyReleaseTimeoutId = GLib.timeout_add(GLib.PRIORITY_DEFAULT, KEY_RELEASE_TIMEOUT, () => {
        this._keyboardController.keyvalRelease(keyvalToPress);
        this._forwardModifiers(this._modifiers, Clutter.EventType.KEY_RELEASE);
        this._disableAllModifiers();
        return GLib.SOURCE_REMOVE;
      });
    }
  }

  if (!this._latched)
    this._setActiveLayer(0);
}

function override_toggleDelete(enabled) {
  if (this._deleteEnabled === enabled) return;

  this._deleteEnabled = enabled;

  if (enabled) {
    this._keyboardController.keyvalPress(Clutter.KEY_BackSpace);
  } else {
    this._keyboardController.keyvalRelease(Clutter.KEY_BackSpace);
  }
}

function override_toggleModifier(key) {
  const { keyval, level } = key;
  const SHIFT_KEYVAL = '0xffe1';
  const isActive = this._modifiers.has(keyval);

  if (keyval === SHIFT_KEYVAL) this._setActiveLayer(level);

  this._setModifierEnabled(keyval, !isActive);
}

function override_setActiveLayer(activeLevel) {
  let activeGroupName = this._keyboardController.getCurrentGroup();
  let layers = this._groups[activeGroupName];
  let currentPage = layers[activeLevel];

  if (this._currentPage == currentPage) {
    this._updateCurrentPageVisible();
    return;
  }

  if (this._currentPage != null) {
    this._setCurrentLevelLatched(this._currentPage, false);
    this._currentPage.disconnect(this._currentPage._destroyID);
    this._currentPage.hide();
    delete this._currentPage._destroyID;
  }
  // === Override starts here ===

  // Don't unlatch modifiers if switching to lower or upper case layer
  if (activeLevel > 1) this._disableAllModifiers();

  // === Override ends here ===
  this._currentPage = currentPage;
  this._currentPage._destroyID = this._currentPage.connect('destroy', () => {
    this._currentPage = null;
  });
  this._updateCurrentPageVisible();
  this._aspectContainer.setRatio(...this._currentPage.getRatio());
  this._emojiSelection.setRatio(...this._currentPage.getRatio());
}

function override_getCurrentGroup() {
  // Special case for Korean, if Hangul mode is disabled, use the 'us' keymap
  if (this._currentSource.id === 'hangul') {
      const inputSourceManager = InputSourceManager.getInputSourceManager();
      const currentSource = inputSourceManager.currentSource;
      let prop;
      for (let i = 0; (prop = currentSource.properties.get(i)) !== null; ++i) {
          if (prop.get_key() === 'InputMode' &&
              prop.get_prop_type() === IBus.PropType.TOGGLE &&
              prop.get_state() !== IBus.PropState.CHECKED)
              return 'us';
      }
  }
  return this._currentSource.xkbId;
}

function enable_overrides() {
  Keyboard.Keyboard.prototype["_relayout"] = override_relayout;
  Keyboard.Keyboard.prototype["_toggleModifier"] = override_toggleModifier;
  Keyboard.Keyboard.prototype["_setActiveLayer"] = override_setActiveLayer;
  Keyboard.Keyboard.prototype["_addRowKeys"] = override_addRowKeys;
  Keyboard.Keyboard.prototype["_commitAction"] = override_commitAction;
  Keyboard.Keyboard.prototype["_toggleDelete"] = override_toggleDelete;

  Keyboard.KeyboardManager.prototype["_lastDeviceIsTouchscreen"] =
    override_lastDeviceIsTouchScreen;

  Keyboard.KeyboardController.prototype["getCurrentGroup"] =
    override_getCurrentGroup;

  // Unregister original osk layouts resource file
  getDefaultLayouts()._unregister();

  // Register modified osk layouts resource file
  getModifiedLayouts()._register();
}

function disable_overrides() {
  Keyboard.Keyboard.prototype["_relayout"] = backup_relayout;
  Keyboard.Keyboard.prototype["_toggleModifier"] = backup_toggleModifier;
  Keyboard.Keyboard.prototype["_setActiveLayer"] = backup_setActiveLayer;
  Keyboard.Keyboard.prototype["_addRowKeys"] = backup_addRowKeys;
  Keyboard.Keyboard.prototype["_commitAction"] = backup_commitAction;
  Keyboard.Keyboard.prototype["_toggleDelete"] = backup_toggleDelete;

  Keyboard.KeyboardManager.prototype["_lastDeviceIsTouchscreen"] =
    backup_lastDeviceIsTouchScreen;

  Keyboard.KeyboardController.prototype["getCurrentGroup"] =
    backup_getCurrentGroup;

  // Unregister modified osk layouts resource file
  getModifiedLayouts()._unregister();

  // Register original osk layouts resource file
  getDefaultLayouts()._register();
}

function getModifiedLayouts() {
  const modifiedLayoutsPath = Me.dir
    .get_child("data")
    .get_child("gnome-shell-osk-layouts.gresource")
    .get_path();
  return Gio.Resource.load(modifiedLayoutsPath);
}

function getDefaultLayouts() {
  return Gio.Resource.load(
    (GLib.getenv("JHBUILD_PREFIX") || "/usr") +
      "/share/gnome-shell/gnome-shell-osk-layouts.gresource"
  );
}

// In case the keyboard is currently disabled in accessibility settings, attempting to _destroyKeyboard() yields a TypeError ("TypeError: this.actor is null")
// This function proofs this condition, which would be used in the parent function to determine whether to run _setupKeyboard
function tryDestroyKeyboard() {
  try {
    Main.keyboard._destroyKeyboard();
  } catch (e) {
    if (e instanceof TypeError) {
      return false;
    } else {
      // Something different happened
      throw e;
    }
  }
  return true;
}

// Extension
function init() {
  backup_relayout = Keyboard.Keyboard.prototype["_relayout"];
  backup_toggleModifier = Keyboard.Keyboard.prototype["_toggleModifier"];
  backup_setActiveLayer = Keyboard.Keyboard.prototype["_setActiveLayer"];
  backup_addRowKeys = Keyboard.Keyboard.prototype["_addRowKeys"];
  backup_commitAction = Keyboard.Keyboard.prototype["_commitAction"];
  backup_toggleDelete = Keyboard.Keyboard.prototype["_toggleDelete"];

  backup_lastDeviceIsTouchScreen =
    Keyboard.KeyboardManager._lastDeviceIsTouchscreen;

  backup_getCurrentGroup =
    Keyboard.KeyboardController.prototype["getCurrentGroup"];

  currentSeat = Clutter.get_default_backend().get_default_seat();
  backup_touchMode = currentSeat.get_touch_mode;
}

function enable() {
  settings = ExtensionUtils.getSettings(
    "org.gnome.shell.extensions.improvedosk"
  );
  _oskA11yApplicationsSettings = new Gio.Settings({
    schema_id: A11Y_APPLICATIONS_SCHEMA,
  });

  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

  // Set up the indicator in the status area
  if (settings.get_boolean("show-statusbar-icon")) {
    _indicator = new OSKIndicator();
    Main.panel.addToStatusArea("OSKIndicator", _indicator);
  }

  if (settings.get_boolean("force-touch-input")) {
    currentSeat.get_touch_mode = () => true;
  }

  let KeyboardIsSetup = tryDestroyKeyboard();

  enable_overrides();

  settings.connect("changed::show-statusbar-icon", function () {
    if (settings.get_boolean("show-statusbar-icon")) {
      _indicator = new OSKIndicator();
      Main.panel.addToStatusArea("OSKIndicator", _indicator);
    } else if (_indicator !== null) {
      _indicator.destroy();
      _indicator = null;
    }
  });

  settings.connect("changed::force-touch-input", function () {
    if (settings.get_boolean("force-touch-input")) {
      currentSeat.get_touch_mode = () => true;
    } else {
      currentSeat.get_touch_mode = backup_touchMode;
    }
  });

  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }

  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox, {
    affectsStruts: settings.get_boolean("resize-desktop"),
    trackFullscreen: false,
  });
}

function disable() {
  Main.layoutManager.removeChrome(Main.layoutManager.keyboardBox);

  currentSeat.get_touch_mode = backup_touchMode;

  let KeyboardIsSetup = tryDestroyKeyboard();

  // Remove indicator if it exists
  if (_indicator instanceof OSKIndicator) {
    _indicator.destroy();
    _indicator = null;
  }

  settings = null;

  if (keyReleaseTimeoutId) {
    GLib.Source.remove(keyReleaseTimeoutId);
    keyReleaseTimeoutId = null;
  }

  disable_overrides();

  if (KeyboardIsSetup) {
    Main.keyboard._setupKeyboard();
  }
  Main.layoutManager.addTopChrome(Main.layoutManager.keyboardBox);
}
