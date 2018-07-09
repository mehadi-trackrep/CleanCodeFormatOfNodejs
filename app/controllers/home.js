var bcrypt = require('bcrypt-nodejs');
global.fetch = require('node-fetch');
const cc = require('cryptocompare');
var dateTime = require('node-datetime');

var coins = ['BTC', 'ETH', 'XRP', 'BCH',
'EOS', 'LTC', 'ADA', 'XLM', 'MIOTA', 'TRX', 'NEO', 'USDT', 'XMR', 'DASH', 'XEM', 'VEN', 'ETC', 'BNB', 'QTUM', 'BCN', 'OMG', 'ZEC', 'ICX', 'LSK', 'ONT', 'ZIL', 'AE', 'BTG', 'DCR', 'ZRX', 'BTM', 'STEEM', 'XVG', 'NANO',
'BTS', 'SC', 'PPT', 'RHOC', 'WAN', 'MKR', 'BTCP', 'GNT', 'BCD', 'STRAT', 'REP', 'WAVES', 'DOGE', 'XIN', 'WICC', 'IOST'
];

exports.loggedIn = function(req, res, next) {
  if (req.session.user) { // req.session.passport._id
    next();
  } else {
    res.redirect('/login');
  }
}

exports.homePage = function(req, res, next) {
  var username = "";
  if(req.session.username){
    console.log("user is logged in ..");
    username = req.session.username;
  }

  cc.priceFull(coins, ['USD', 'EUR'])
  .then(prices => {

    cc.coinList()
    .then(coinList => {

    var keyNames = Object.keys(prices);
    var price_store = [];
    var coinnames = [];

    var dt = dateTime.create();
    var formatted = dt.format('Y-m-d H:M:S');

    for (var i=0; i<keyNames.length; i++){
      var val = keyNames[i];
      try {
          // console.log(coinList.Data[val]['FullName']);
          // price_store.push(prices[val]['USD']['PRICE'];);

          price_value = prices[val]['USD']['PRICE'];
          price_value += '';

          var y;

          y = price_value.split('.');

          var y1,y2;

          y1 = y[0];
          y2 = y.length > 1 ? '.' + y[1] : '';

          var rgx = /(\d+)(\d{3})/;
          while (rgx.test(y1)) {
           y1 = y1.replace(rgx, '$1' + ',' + '$2');
          }

          price_value = y1 + y2;
          price_store.push(price_value);
          coinnames.push(coinList.Data[val]['FullName']);
        }
        catch(err) {
            // console.log(val);
            coinnames.push(val);
        }
    }
      res.render('index', {success_msg:req.flash('success_msg'),error_msg:req.flash('error_msg'),
                          username: username, coinlist: keyNames, prices: prices,
                          coinnames: coinnames});
    }).catch(console.error);
  }).catch(console.error);
}

exports.logOut = function(req, res, next) {
  console.log('.. logout is done .. ');
  if (req.session.user) {
    req.logout();
    req.flash('success_msg', 'You are logged out!!');
		req.session.destroy(); // Distroy the session (V.V.I.)
    res.redirect('/login');
  } else {
    next();
  }
}

exports.signup = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('signup', {
      error: req.flash("error_msg"),
      success: req.flash("success_msg"),
      session: req.session
    });
  }
}


exports.login = function(req, res) {
  if (req.session.user) {
    res.redirect('/');
  } else {
    res.render('login', {
      error: req.flash("error_msg"),
      success: req.flash("success_msg"),
      session: req.session
    });
  }
}
