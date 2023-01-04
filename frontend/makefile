
EAS = eas
NPM = npm

install:
	$(NPM) install -g eas-cli

login:
	$(EAS) login

configure:
	$(EAS) build:configure

build-android:
	$(EAS) build --platform android

build-ios:
	$(EAS) build --platform ios