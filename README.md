# open.Yellow.osのbuild tool
open.Yellow.osは、 MX LinuxのGitHubで公開されている「build-iso-mx」をカスタマイズしたビルドツールを使用しております。


# 環境
open.Yellow.osでビルドすることを想定しています。
　※DebianまたはDebian派生のOSでもビルドできると思いますが、詳しい検証は行っていません。



# 事前準備
ビルドに必要なパッケージをインストールします。

`sudo apt install debootstrap syslinux-utils zsync expect git`

※Ubuntuでビルドする場合は「binutils」も必要です。

# ビルド
## oYoのGitからbuild-iso-mxのソースを取得する
任意のディレクトリで以下のコマンドを実行し、Gitからbuild-iso-mxのソースを取得します。

`git clone https://scm.osdn.net/gitroot/open-yellow-os/open-yellow-os.git`


## build-iso-linuxディレクトリへ移動する
ターミナルを起動しbuild-iso-mxディレクトリに移動します。

`cd open-yellow-os`


## 以下のコマンドで、ビルドを開始する
ターミナルで以下のコマンドを実行し、ビルドを開始します。

`sudo ./build-iso -0`

※[-0]は、一番最初から処理を実行するためのオプションです。
　build-iso-toolは、処理の途中からやり直すこともできます。
　その場合は、0以外の数字を指定します。 
