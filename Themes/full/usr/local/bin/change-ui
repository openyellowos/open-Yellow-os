#!/bin/bash

############################################################################
##
##  名称：change_ui
##  処理：UIを変更する
##
############################################################################


############################################################################
## oYo Original Style UI
############################################################################
change_ui_oYo_original() {
     #拡張機能　無効化
    dconf write /org/gnome/shell/disable-user-extensions true
    
    ###dash-to-dock###
    #/org/gnome/shell/extensions/dash-to-dock/
    dconf write /org/gnome/shell/extensions/dash-to-dock/custom-theme-shrink true
    dconf write /org/gnome/shell/extensions/dash-to-dock/dock-fixed true
    dconf write /org/gnome/shell/extensions/dash-to-dock/dash-max-icon-size 32
    dconf write /org/gnome/shell/extensions/dash-to-dock/extend-height true
    dconf write /org/gnome/shell/extensions/dash-to-dock/dock-position "'LEFT'"
    dconf write /org/gnome/shell/extensions/dash-to-dock/running-indicator-style "'DOTS'"
    dconf write /org/gnome/shell/extensions/dash-to-dock/transparency-mode "'DYNAMIC'"
    dconf write /org/gnome/shell/extensions/dash-to-panel/stockgs-keep-dash true
    dconf write /org/gnome/shell/extensions/dash-to-dock/show-apps-at-top false
    dconf write /org/gnome/shell/extensions/dash-to-dock/click-action "'minimize'"  
     
    ###dconf write /org/gnome/desktop/wm/preferences/###     
    dconf write /org/gnome/desktop/wm/preferences/button-layout "'appmenu:minimize,maximize,close'"

     #有効なExtension
    dconf write /org/gnome/shell/enabled-extensions "['dash-to-dock@micxgx.gmail.com','add-to-desktop@tommimon.github.com','ding@rastersoft.com','kimpanel@kde.org']"
     #無効なEcxtension
     dconf write /org/gnome/shell/disabled-extensions "'[]'"

     #拡張機能　有効化
    dconf write /org/gnome/shell/disable-user-extensions false
}

############################################################################
## Windows Style UI
############################################################################
change_ui_windows_style() {
     #拡張機能　無効化
    dconf write /org/gnome/shell/disable-user-extensions true
    
    ###/org/gnome/shell/extensions/arcmenu/###
     #メニューレイアウト
    dconf write /org/gnome/shell/extensions/arcmenu/menu-layout "'Windows'"
     #パネル内の位置
    dconf write /org/gnome/shell/extensions/arcmenu/position-in-panel "'Left'"

    ###/org/gnome/shell/extensions/dash-to-panel/###
     #パネル位置
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-positions "'{\"0\":\"BOTTOM\"}'"
     #パネルサイズ
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-sizes "'{\"0\":36}'"
     
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-element-positions "'{\"0\":[{\"element\":\"showAppsButton\",\"visible\":false,\"position\":\"stackedTL\"},{\"element\":\"activitiesButton\",\"visible\":false,\"position\":\"stackedTL\"},{\"element\":\"leftBox\",\"visible\":true,\"position\":\"stackedTL\"},{\"element\":\"taskbar\",\"visible\":true,\"position\":\"stackedTL\"},{\"element\":\"centerBox\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"rightBox\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"dateMenu\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"systemMenu\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"desktopButton\",\"visible\":true,\"position\":\"stackedBR\"}]}'"
    
    ###dconf write /org/gnome/desktop/wm/preferences/###     
    dconf write /org/gnome/desktop/wm/preferences/button-layout "'appmenu:minimize,maximize,close'"

     #有効なExtension
    dconf write /org/gnome/shell/enabled-extensions "['arcmenu@arcmenu.com','dash-to-panel@jderose9.github.com','add-to-desktop@tommimon.github.com','ding@rastersoft.com','kimpanel@kde.org']"
     #無効なEcxtension
    dconf write /org/gnome/shell/disabled-extensions "'[]'"

     #拡張機能　有効化
    dconf write /org/gnome/shell/disable-user-extensions false
}

############################################################################
## Mac Style UI
############################################################################
change_ui_mac_style() {
     #拡張機能　無効化
    dconf write /org/gnome/shell/disable-user-extensions true
    
    ###/org/gnome/shell/extensions/arcmenu/###
     #メニューレイアウト
    dconf write /org/gnome/shell/extensions/arcmenu/menu-layout "'Brisk'"
     #パネル内の位置
    dconf write /org/gnome/shell/extensions/arcmenu/position-in-panel "'Left'"

    ###dash-to-dock###
    #/org/gnome/shell/extensions/dash-to-dock/
    dconf write /org/gnome/shell/extensions/dash-to-dock/custom-theme-shrink true
    dconf write /org/gnome/shell/extensions/dash-to-dock/dock-fixed false
    dconf write /org/gnome/shell/extensions/dash-to-dock/dash-max-icon-size 38
    dconf write /org/gnome/shell/extensions/dash-to-dock/extend-height false
    dconf write /org/gnome/shell/extensions/dash-to-dock/dock-position "'BOTTOM'"
    dconf write /org/gnome/shell/extensions/dash-to-dock/running-indicator-style "'DOTS'"
    dconf write /org/gnome/shell/extensions/dash-to-dock/transparency-mode "'DYNAMIC'"
    dconf write /org/gnome/shell/extensions/dash-to-panel/stockgs-keep-dash true
    dconf write /org/gnome/shell/extensions/dash-to-dock/show-apps-at-top true
    dconf write /org/gnome/shell/extensions/dash-to-dock/click-action "'minimize'"

    ###/org/gnome/shell/extensions/dash-to-panel/###
     #パネル位置
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-positions "'{\"0\":\"TOP\"}'"
     #パネルサイズ
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-sizes "'{\"0\":32}'"
    dconf write /org/gnome/shell/extensions/dash-to-panel/panel-element-positions "'{\"0\":[{\"element\":\"showAppsButton\",\"visible\":false,\"position\":\"stackedTL\"},{\"element\":\"activitiesButton\",\"visible\":false,\"position\":\"stackedTL\"},{\"element\":\"leftBox\",\"visible\":true,\"position\":\"stackedTL\"},{\"element\":\"taskbar\",\"visible\":false,\"position\":\"stackedTL\"},{\"element\":\"centerBox\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"rightBox\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"systemMenu\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"desktopButton\",\"visible\":true,\"position\":\"stackedBR\"},{\"element\":\"dateMenu\",\"visible\":true,\"position\":\"stackedBR\"}]}'"

    ###dconf write /org/gnome/desktop/wm/preferences/###     
    dconf write /org/gnome/desktop/wm/preferences/button-layout "'close,minimize,maximize:appmenu'"

     #有効なExtension
    dconf write /org/gnome/shell/enabled-extensions "['arcmenu@arcmenu.com', 'dash-to-panel@jderose9.github.com', 'add-to-desktop@tommimon.github.com', 'ding@rastersoft.com', 'kimpanel@kde.org', 'dash-to-dock@micxgx.gmail.com']"
     #無効なEcxtension
    dconf write /org/gnome/shell/disabled-extensions "'[]'"
    
     #拡張機能　有効化
    dconf write /org/gnome/shell/disable-user-extensions false
}

############################################################################
## メイン処理
############################################################################
OYO_UI="oYo Original Style"
WINDOWS_UI="Windows UI Style"
MAC_UI="Mac UI Style"

VALUE=$(zenity --title "oYo UI Changer" \
               --list \
               --radiolist \
               --hide-header \
               --width 320 \
               --height 240 \
               --text "UIを選択して、OKボタンを押してください。" \
               --cancel-label "閉じる" \
               --column "select" \
               --column "UI" FALSE "$OYO_UI" FALSE "$WINDOWS_UI"  FALSE "$MAC_UI")

EXITCODE=$?
if [ $EXITCODE = 0 ]; then
    if [ "$VALUE" == "$OYO_UI" ]; then
        change_ui_oYo_original
        zenity --info \
               --text="$OYO_UIに変更しました。"
    elif [ "$VALUE" == "$WINDOWS_UI" ]; then
        change_ui_windows_style
        zenity --info \
               --text="$WINDOWS_UIに変更しました。"
    elif [ "$VALUE" == "$MAC_UI" ]; then
        change_ui_mac_style
        zenity --info \
               --text="$MAC_UIに変更しました。"
    else
        zenity --info \
               --text="どれか１つを選択してください。"
    fi
     
    change-ui
fi
