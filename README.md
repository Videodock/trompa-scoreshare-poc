# TROMPA POC ScoreShare
Videodock, Roy Schut

This repository connects several TROMPA modules and serves as a POC for choirs and conductors that want to share music scores, selections and annotations.
The POC makes use of partner modules from within the TROMPA project, such as the selectable-score by David Weigl, the ce-api, multimodal-component and the beatannotator.
Google Firebase and Firestore are used for the live aspect: selections and annotations shared and edited live.

### Use case
The conductor runs the app, selects a score from ce, makes selections and annotations.
The choir singers get to see the same score, as well as the selections and annotations the conductor makes.
The singer/other users can make their own selections to see all annotations made. Selection of conductor takes over again once made by conductor.

## Run
To run this project, clone this repository, then:
```
cd trompa-sheetshare-poc
npm install
npm start
```
Browse at https://localhost:8080.

The poc uses Firebase. Currently it points to a DB made by me, but you can set one up yourself.
The conductor (for now) adds the `?conductor=1433622342352` query to the URL.

## Next Up
- Implement Solid Pods
- Implement video communication
- Build extra functionality for conductor

## Known issues
The list of dependencies is long, because of the try-out of several components. Needs a clean-up once the direction is clear.
Rendering of score (using selectable-score, MELD and Verovio) is slow, which David Weigl is working on.

## Further reading
For more information on TROMPA see the [TROMPA website](https://trompamusic.eu) and the following paper:

* [DLfM 2019 overview paper on TROMPA](https://dl.acm.org/doi/10.1145/3358664.3358666)