

function init() {
  UI.init();
  if (location.hash) {
    Data.tactic.play = location.hash.substr(1);
  }
  Field.setupField();
  Data.load_plays(ondataloaded);
}

function ondataloaded() {
  UI.reset_values();
  Field.draw_area(1);
}
