import Gallary from "./gallery-lib/gallery"

new Gallary(document.getElementById('gallery-1'), document.getElementById('gallery-1-nav'), {
    margin: 20,
    hasTimer: true,
    hasToggle: true,
    hasToggleText: false,
    isSliderNotRound: true,
    breakpoints: { starting: 375, ending: 1220 }
  })

new Gallary(document.getElementById('gallery-2'), document.getElementById('gallery-2-nav'), {
  margin: 20,
  hasTimer: false,
  hasToggle: false,
  hasToggleText: true,
  isSliderNotRound: true,
})