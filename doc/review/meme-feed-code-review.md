The issue:
Instead of loading all the datas at once, requests was triggered in a nested for loop for get the pictures, memes, and users and the same datas were loaded multiples times

Solutions found:
- Now we'll load all the memes progressively, when the user will scroll to the last meme then the next 10 will be loaded. 
- For load the users, we'll load all only the users that are displayed on the screen (meme & comment authors)