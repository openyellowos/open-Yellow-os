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
            id: image01
            source: "slide01.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
    Slide {
        Image {
            id: image02
            source: "slide02.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
    Slide {
        Image {
            id: image03
            source: "slide03.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
    Slide {
        Image {
            id: image04
            source: "slide04.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
    Slide {
        Image {
            id: image05
            source: "slide05.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
    Slide {
        Image {
            id: image06
            source: "slide06.png"
            width: 864
            fillMode: Image.PreserveAspectFit
            anchors.centerIn: parent
          }
     }
}
