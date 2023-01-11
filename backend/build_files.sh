# build_files.sh

pip3 install "setuptools<58"
pip3 install psycopg2-binary
pip3 install -r requirements.txt
pip3 install --upgrade pip

python3 manage.py collectstatic