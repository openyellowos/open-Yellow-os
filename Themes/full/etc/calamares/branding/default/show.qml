import QtQuick 2.0;
import calamares.slideshow 1.0;

Presentation
{
    id: presentation

    Timer {
        interval: 10000
        running: true
        repeat: true
        onTriggered: presentation.goToNextSlide()
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image01
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide01.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image02
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide02.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image03
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide03.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image04
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide04.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image05
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide05.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image06
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide06.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image07
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide07.jpg"
          }
     }
    Slide {
        Image {
            anchors.centerIn: parent
            id: image08
            x:0
            y:0
            width: 800
            height: 450
            fillMode: Image.PreserveAspectFit
            smooth: true
            source: "slide08.jpg"
          }
     }
}
