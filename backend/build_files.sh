# build_files.sh

DIR=./
if [ -d "$DIR/staticfiles_build" ];
then
	rm -rf "$DIR/staticfiles_build"
else
	mkdir "$DIR/staticfiles_build"
fi


pip3 install --upgrade pip
pip3 install "setuptools<58.0.0"
pip3 install psycopg2-binary
pip3 install -r req.txt

python3.9 manage.py collectstatic