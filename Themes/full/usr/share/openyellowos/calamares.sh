#! /usr/bin/env bash

# remove Polkit config for live user
rm -f /etc/polkit-1/localauthority/50-local.d/47-allow-live-user.pkla

# remove nopassword
rm -f /etc/sudoers.d/wheel

# Disable autologin
cp /usr/share/openyellowos/daemon.conf /etc/gdm3/ 
