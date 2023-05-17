export let level1_map;
export let level2_map;
export let level3_map;

export let buildMaps = () => {
  return Promise.all([
    fetch('/level/level1_map.txt').then(response => response.text()),
    fetch('/level/level2_map.txt').then(response => response.text()),
    fetch('/level/level3_map.txt').then(response => response.text())
  ])
    .then(([mapData1, mapData2, mapData3]) => {
      let x_lines1 = mapData1.split("\n");
      level1_map = x_lines1.map(line => line.split(','));

      let x_lines2 = mapData2.split("\n");
      level2_map = x_lines2.map(line => line.split(','));

      let x_lines3 = mapData3.split("\n");
      level3_map = x_lines3.map(line => line.split(','));
    })
    .catch(error => {
      console.error('Error loading maps:', error);
    });
};