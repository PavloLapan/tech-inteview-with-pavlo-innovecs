# APP CHANGES

Created new ts app due to issue with configs of tsconfig and some others error  (based also with openssl), spend some time for understand why that happens 

Looks like cover all the requirements exept one (// Since the search results may be huge, we need to have some kind of optimization, please propose a solution )

Means that we can add additional library for implement optimization of  the rendering and improve user experience, such as react-window library with 'FixedSizeList ' component 

Didn`t split the code for folders and services for faster review, added some comments where it should be implemented 

Added MUI for visualisation list nicely

PR with 1 commit based on env issues ( re-installed node and lots of bugs with my local env, try install and run your project, it looks like problem with node but then need to change version of react)