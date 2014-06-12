function Board ()
{
  this.maxX = 15;   // board width
  this.maxY = 15;   // board height

  this.grid = new Array();  // a 2D array to hold the squares

  for (var y = 0; y < this.maxY; y += 1) this.grid[y] = new Array();

  this.generate = function ()
  {
    // This array of strings will allow us to easily reconfigure
    // the board's setup visually.
    var stupidGrid = ["tw .. .. dl .. .. .. tw .. .. .. dl .. .. tw",
                       ".. dw .. .. .. tl .. .. .. tl .. .. .. dw ..",
                       ".. .. dw .. .. .. dl .. dl .. .. .. dw .. ..",
                       "dl .. .. dw .. .. .. dl .. .. .. dw .. .. dl",
                       ".. .. .. .. dw .. .. .. .. .. dw .. .. .. ..",
                       ".. tl .. .. .. tl .. .. .. tl .. .. .. tl ..",
                       ".. .. dl .. .. .. dl .. dl .. .. .. dl .. ..",
                       "tw .. .. dl .. .. .. st .. .. .. dl .. .. tw",
                       ".. .. dl .. .. .. dl .. dl .. .. .. dl .. ..",
                       ".. tl .. .. .. tl .. .. .. tl .. .. .. tl ..",
                       ".. .. .. .. dw .. .. .. .. .. dw .. .. .. ..",
                       "dl .. .. dw .. .. .. dl .. .. .. dw .. .. dl",
                       ".. .. dw .. .. .. dl .. dl .. .. .. dw .. ..",
                       ".. dw .. .. .. tl .. .. .. tl .. .. .. dw ..",
                       "tw .. .. dl .. .. .. tw .. .. .. dl .. .. tw"];

    // stupid_grid will get read by the function to create the letter
    // objects that will fill the "smart grid".

    // stringX keeps track of the horizontal position in the string array,
    // since the increment is 3 instead of 1                        
    var stringX = 0;

    // run through the string array for x and y, creating a table of divs in
    // the html as we go.
    $(".board").append ("<table>");

    for (var y = 0; y < this.maxY; y += 1)
    {
      $(".board").append ("<tr>");

      for (var x = 0; x < this.maxX; x += 1)
      {
        var newSquare  = stupidGrid[y].substring (stringX, stringX + 2);
        var htmlInsert = "";

             if (newSquare == "st") htmlInsert = "square start'>*";           // start or star
        else if (newSquare == "dl") htmlInsert = "square double-letter'>DL";  // double letter
        else if (newSquare == "tl") htmlInsert = "square triple-letter'>TL";  // triple letter
        else if (newSquare == "dw") htmlInsert = "square double-word'>DW";    // double word
        else if (newSquare == "tw") htmlInsert = "square triple-word'>TW";    // triple word
        else                        htmlInsert = "square blank'>.";           // blank square

        // The invisible "." needs to be on the blank div.
        // If the board divs are completely blank, the tiles shift downward for some reason.
        // A medal if you can figure out how to fix that.
          
        // if you need to print grid coordinates
        //$(".board").append ("<td><div class='" + htmlInsert + " " + x + ", " + y + "</div></td>");

        $(".board").append ("<td><div class='" + htmlInsert + "</div></td>");
        this.grid[x][y] = new Square (newSquare);  // add the actual square to the data grid

        stringX += 3;  // move the string reader horizontally
      }
      $(".board").append ("</tr>");
      stringX = 0;
    }
    $(".board").append ("</table>");
  }
}
