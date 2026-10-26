const fotos = {
  Fútbol: [
    "Lionel-Messi-Argentina-2022-FIFA-World-Cup (cropped 4).jpg",
    "Hossein Zohrevand / Tasnim News Agency",
    "CC BY 4.0",
  ],
  Vóley: [
    "Volleyball at the 2020 Summer Olympics - Argentina (men).jpg",
    "Secretaría de Deportes de Argentina",
    "CC BY 4.0",
  ],
  Básquet: ["Manu Ginóbili.jpg", "Mike (RMTip21)", "CC BY-SA 2.0"],
  Natación: [
    "Swimming YOG18 12-10-2018 (03).jpg",
    "Mauricio V. Genta",
    "CC BY-SA 4.0",
  ],
  Patín: [
    "Patinaje Artistico (24611390876).jpg",
    "Ver ficha original de Wikimedia Commons",
    "Ver ficha",
  ],
  Ajedrez: ["Chess tournament.jpg", "Chessindia", "CC BY 4.0"],
  Fitness: ["Fitness exercise.jpg", "Robertgombos", "CC BY-SA 4.0"],
  Bienestar: ["Yoga class.jpg", "Rajanbastola", "CC BY-SA 4.0"],
};

export const fotosDeportivas = Object.entries(fotos).map(
  ([disciplina, [archivo, autor, licencia]]) => ({
    disciplina,
    autor,
    licencia,
    ficha: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(archivo.replaceAll(" ", "_"))}`,
    imagen:
      disciplina === "Fútbol"
        ? "https://upload.wikimedia.org/wikipedia/commons/c/c5/Lionel-Messi-Argentina-2022-FIFA-World-Cup_%28cropped_4%29.jpg"
        : `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(archivo.replaceAll(" ", "_"))}?width=960`,
  }),
);

export function fotoDeActividad(disciplina) {
  return (
    fotosDeportivas.find((foto) => foto.disciplina === disciplina)?.imagen ||
    null
  );
}
