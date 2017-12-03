mogrify -gravity center -background transparent -density 72 -extent 40x40 "./*"
mogrify -filter point -gravity center -background transparent -density 72 -resize 200% "./*"

