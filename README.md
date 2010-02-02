Dress to Impress, by OpenNeo
============================================

(We call it "Impress" for short.)

A PHP5 app that allows users to preview how clothes and backgrounds will look
on their Neopets. Yes, Neopets. It just so happens to offer many great
opportunities for coding projects.

Currently we're in closed development until the project is ready to take
center-stage, but feel free to poke around, download a copy, and trace our
development process.

Impress is run by a very small, very new, in-house MVC framework named Pwnage,
whose contents are in the /pwnage/ directory. Feel free to take a look.

This project distributed under a variant of the MIT License - see the LICENSE
file.

Dependencies:
-------------
  - PHP5, for obvious reasons
  - MySQL, for data storage
  - Curl, for HTTP requests
  - libtidy, for Tidy PEAR module (http://tidy.sourceforge.net/)
  - PEAR modules:
    - SabreAMF, to load wearables AMF data (http://osflash.org/sabreamf)
    - phpQuery, to parse NC Mall HTML(http://code.google.com/p/phpquery/)
    - Tidy, to fix TNT's malformed Mall HTML (http://php.net/manual/en/book.tidy.php)
  - Smarty, for templating
  - ...probably something else. Let me know if you see errors.
  
If you're installing on Ubuntu, note that the following packages will save you
some time:

  - php5
  - mysql
  - php5-mysql
  - php5-curl
  - php5-tidy
  - php-pear
  - smarty

SabreAMF and phpQuery must be installed PEAR modules, so see their homepages.
