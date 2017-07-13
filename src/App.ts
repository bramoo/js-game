window.onload = () => {
    var game = new Tsgame.Game();

    var webFontConfig = {
        active: () => (game.state.getCurrentState() as Tsgame.State.Boot).webFontsLoaded(),
        google: {
            families: [
                'Audiowide',
                'Bungee',
                'Bungee+Hairline',
                'Bungee+Inline',
                'Bungee+Outline',
                'Gruppo',
                'Monoton']
        }
    };

    WebFont.load(webFontConfig);
};

