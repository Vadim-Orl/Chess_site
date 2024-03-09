import Gallary from "./gallery-lib/gallery"

// Window.resize(function() {

if(window.innerWidth < 1200) {
  runGallety1();
}

window.addEventListener('resize', runGallety1);

function runGallety1() {
  const gal1 = null;
  console.log(window.innerWidth)
  console.log(window.innerWidth < 1200)
  if(window.innerWidth < 1200) {

    gal1 = new Gallary(document.getElementById('gallery-1'), document.getElementById('gallery-1-nav'), {
      margin: 20,
      hasTimer: false,
      hasToggle: true,
      hasToggleText: false,
      isSliderNotRound: true
    })
  } else {
    delete gal1;
  }
}


// });


console.log('hello')