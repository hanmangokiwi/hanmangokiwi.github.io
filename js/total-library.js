//page index, page length
page = [0,1]
bookNum = 0
pageChars = 0
bookID = "0"
bookContents = ""
uniqueChars = [
    "a",
    "b",
    "c",
    "d",
    "e",
    "f",
    "g",
    "h",
    "i",
    "j",
    "k",
    "l",
    "m",
    "n",
    "o",
    "p",
    "q",
    "r",
    "s",
    "t",
    "u",
    "v",
    "w",
    "x",
    "y",
    "z",
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "8",
    "9",
    ".",
    "!",
    "?",
    '"',
    ":",
    ";",
    "-"
]

searchText = function(){
}

turnPage = function(direction){
    switch(direction){
        case "first":
            page[0] = 0
            break
        case "left":
            if(page[0]==0){
                bookNum--
            }else{
                page[0]--
            }
            break
        case "right":
            if(page[0]==page[1]-1){
                bookNum++
                page[0]=0
            }else{
                page[0]++
            }
            break
        case "last":
            page[0]=page[1]-1
    }
    grabPageContents()
}
//3800 is max chars
function grabPageContents(){









  document.getElementById("page-text").innerHTML="test"

}