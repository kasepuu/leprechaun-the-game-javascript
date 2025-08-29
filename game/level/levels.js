export let level1_map;
export let level2_map;
export let level3_map;

export let levelMaps = [[], [], []]


export let buildMaps = () => {
  return Promise.all([
    fetch('game/level/level1_map.txt').then(response => response.text()),
    fetch('game/level/level2_map.txt').then(response => response.text()),
    fetch('game/level/level3_map.txt').then(response => response.text())
  ])
    .then(([mapData1, mapData2, mapData3]) => {
      let x_lines1 = mapData1.split("\n");
      levelMaps[0].push(x_lines1.map(line => line.split(',')));

      let x_lines2 = mapData2.split("\n");
      levelMaps[1].push(x_lines2.map(line => line.split(',')));

      let x_lines3 = mapData3.split("\n");
      levelMaps[2].push(x_lines3.map(line => line.split(',')));
    })
    .catch(error => {
      console.error('Error loading maps:', error);
    });
};