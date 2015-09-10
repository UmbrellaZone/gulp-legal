nvm use v0.12.7
read -p "Do you want to install tsd first?" -n 1 -r
echo    # (optional) move to a new line
if [[ $REPLY =~ ^[Yy]$ ]]
then
echo 'installing dependencies'
npm install -g tsd
bash -c 'cd ../ && tsd install'
fi

gulp