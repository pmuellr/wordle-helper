wordle-helper - a CLI helper for wordle
================================================================================

A little helper for wordle.  


usage
================================================================================

Run with no options for an interactive session, or with a file name that
contains guesses and responses

    wordle-helper
    wordle-helper 2020-01-17.txt

In both cases, you'll be entering each guess you're making at wordle, followed
by it's responses, in one of these characters:

- `-` (wrong guess)
- `g` (green) 
- `y` (yellow)

After each line some summary information will be printed.  Mainly a list of the
word possibilities after using the yellow letters in any legal position.


example
================================================================================

input:

    stair g--yy
    shori gg-gy
    shire ggggg
    
output:

    guess and response>  stair g--yy
    ----------------------------------------------------------
    S T A I R   G - - Y Y

    available letters:      B C D E F G H I J K L M N O P Q R S U V W X Y Z
    unavailable letters:    A T

    possibilities:
    SIR__
    SI_R_
    SRI__
    SR__I
    S_IR_
    S_R_I
    S__RI

    guess and response>  shori gg-gy
    ----------------------------------------------------------
    S T A I R   G - - Y Y
    S H O R I   G G - G Y

    available letters:      B C D E F G H I J K L M N P Q R S U V W X Y Z
    unavailable letters:    A O T

    possibilities:
    SHIR_

    guess and response>  shire ggggg
    ----------------------------------------------------------
    S T A I R   G - - Y Y
    S H O R I   G G - G Y
    S H I R E   G G G G G

    available letters:      B C D E F G H I J K L M N P Q R S U V W X Y Z
    unavailable letters:    A O T

    possibilities:
    SHIRE

    complete in 0:47

installation
================================================================================

Requires [Deno](https://deno.land/).  Download the script to run.


changelog
================================================================================

version 0.0.1 - 2022-01-16

- initial version, under active development


license
================================================================================

This package is licensed under the MIT license.  See the [LICENSE.md][] file
for more information.


contributing
================================================================================

Awesome!  We're happy that you want to contribute.

Please read the [CONTRIBUTING.md][] file for more information.


[LICENSE.md]: LICENSE.md
[CONTRIBUTING.md]: CONTRIBUTING.md
[CHANGELOG.md]: CHANGELOG.md