//coursesTwoPoints.js
//file to keep al the courses with two point maps

// Object to group all courses
const courses = {
    "play-delfland-par3-hole1": {
        "Delfland par 3 hole 1": { distance: 90, start: { x: 343, y: 931 }, end: { x: 213, y: 119 } },
        "Delfland par 3 hole 2": { distance: 136, start: { x: 36, y: 291 }, end: { x: 1172, y: 224 } },
        "Delfland par 3 hole 3": { distance: 70, start: { x: 347, y: 142 }, end: { x: 378, y: 750 } },
        "Delfland par 3 hole 4": { distance: 105, start: { x: 268, y: 875 }, end: { x: 351, y: 158 } },
        "Delfland par 3 hole 5": { distance: 91, start: { x: 1209, y: 189 }, end: { x: 305, y: 197 } },
        "Delfland par 3 hole 6": { distance: 138, start: { x: 1352, y: 85 }, end: { x: 175, y: 163 } },
        "Delfland par 3 hole 7": { distance: 115, start: { x: 1163, y: 86 }, end: { x: 250, y: 315 } },
        "Delfland par 3 hole 8": { distance: 108, start: { x: 1118, y: 83 }, end: { x: 243, y: 306 } },
        "Delfland par 3 hole 9": { distance: 82, start: { x: 46, y: 338 }, end: { x: 723, y: 236 } }
    },
    "play-Hitland-par3": {
        "Hitland par 3 hole 1": { distance: 103, start: { x: 155, y: 20 }, end: { x: 103.27, y: 471.42 } },
        "Hitland par 3 hole 2": { distance: 62, start: { x: 57, y: 110 }, end: { x: 368, y: 131 } },
        "Hitland par 3 hole 3": { distance: 102, start: { x: 43, y: 47 }, end: { x: 643, y: 98 } },
        "Hitland par 3 hole 4": { distance: 77, start: { x: 290, y: 35 }, end: { x: 156, y: 426 } },
        "Hitland par 3 hole 5": { distance: 104, start: { x: 696, y: 192 }, end: { x: 128, y: 130 } },
        "Hitland par 3 hole 6": { distance: 90, start: { x: 52, y: 53 }, end: { x: 478, y: 157 } },
        "Hitland par 3 hole 7": { distance: 83, start: { x: 578, y: 267 }, end: { x: 134, y: 132 } },
        "Hitland par 3 hole 8": { distance: 98, start: { x: 125, y: 654 }, end: { x: 161, y: 122 } },
        "Hitland par 3 hole 9": { distance: 133, start: { x: 83, y: 763 }, end: { x: 140, y: 131 } }
    }
};

window.courses = courses;  // Voeg de courses toe aan de window-scope als het nodig is
