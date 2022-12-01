# build_files.sh
pip3 install -r requirements.txt
pip3 install --upgrade pip
python3.9 manage.py collectstatic