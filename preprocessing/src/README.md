## Next Steps
- Update metadata and skip photo processing if photo is same
- Reject photos without titles in metadata
- Move project to homepage repo
-

## Overview of Photo Processing

- Calculate the phash of the image to determine if it exists already or, if it needs to be processed.
- Process versions if required.
- Extract metadata from the original files.
- Build various indexes and metadata json files for querying.
  - Complete index of all image files.
  - Index of each date.
  - Single file metadata including
    - latitude longitude
    - dateCreated
    - datetimeCreated
    - filename
    - phash


## Overview of Story Processing

- Write to markdown file
- Generate JSON file including body and metadata
- Create list of photos that exist in a story
  - Gather the metadata from those
  - Maybe that goes into the actual file, maybe they're fetched separately.


## Docker
```
docker build \
  -t corylogan/node_python . \
  -t corylogan/node_python:latest . 
```
