App = {
  accountList: {},
  web3Provider: null,
  contracts: {},
  account: '0x0',
  hasVoted: false,
  garbage_type: {'1': 'Glass', '2': 'Iron', '3': 'Paper'},
  statuses: {'0': 'Waiting', '1': 'Processing', '2': 'Delivered', '3': 'Confirmed'},
  accountType: "",

  init: function() {
    return App.initWeb3();
  },
  initWeb3: function() {
    // TODO: refactor conditional
    if (typeof web3 !== 'undefined') {



      // If a web3 instance is already provided by Meta Mask.
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);

    } else {
      // Specify default instance if no web3 instance provided
      //red ganache
      App.web3Provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(App.web3Provider);
    }
    var accounts = web3.eth.getAccounts((err, accounts) => {
      App.accountList["0x94d17d3c6fb1775691213fe4f73e5447fd88b4fa"] = 'comunity';
      App.accountList["0x1426e7fc88ed1223fb4f2bc758cadc576d10da9f"] = 'recycler';
      App.accountList["0x4b98f12045391386b2e5170963a4f62a3655e1b4"] = 'supervisor';
      console.log(err, accounts);
    });


    return App.initContract();
  },

  initContract: function() {
    $.getJSON("Recyclers.json", function(recyclers) {
      // Instantiate a new truffle contract from the artifact
      App.contracts.Recyclers = TruffleContract(recyclers);
      // Connect provider to interact with contract
      App.contracts.Recyclers.setProvider(App.web3Provider);

      App.listenForEvents();

      return App.render();
    });
  },

  // Listen for events emitted from the contract
  listenForEvents: function() {
    App.contracts.Recyclers.deployed().then(function(instance) {
      // Restart Chrome if you are unable to receive this event
      // This is a known issue with Metamask
      // https://github.com/MetaMask/metamask-extension/issues/2393
      instance.ClaimReward({}, {
        fromBlock: 'latest',
        toBlock: 'latest'
      }).watch(function(error, event) {
        console.log("event triggered", event)
        // Reload when a new vote is recorded
        App.render();
      });
    });
  },

  render: function() {
    var recyclersInstance;
    var loader = $("#loader");
    var content = $("#content");

    loader.show();
    content.hide();

    // Load account data
    var accountList = {};
    web3.eth.getCoinbase(function(err, account) {
      if (err === null) {
        App.account = account;
        var account_type = App.accountList[account];
        App.accountType = account_type
        $('#profile_type').text(account_type);
        $('#' + account_type + 'Container').show();
        console.log(account_type);
        console.log(recyclersInstance)
        $("#accountAddress").html("Your Account: " + account);
      }
    });
    //hola
    // Load contract data
    App.contracts.Recyclers.deployed().then(function(instance) {
      recyclersInstance = instance;
      return recyclersInstance.getPackages();
    }).then(function(result) {
        packages = []
        for(var i = 0; i < result[0].length; i++){
          status_id = result[4][i].toString();
          console.log(status_id == 0 );
          packages.push({id: result[0][i].toString(), type: App.garbage_type[result[1][i].toString()], raw_weight: result[2][i].toString(), recycled_weight: result[3][i].toString(), status: App.statuses[result[4][i].toString()], show_collect_button: !(status_id == '0') });
        }
        console.log(packages)
        if(App.accountType == "recycler"){
          var rendered_template = Mustache.render(
      "{{#.}}\
      <div class='alert'>\
  		<i></i> Comunity {{ id}}\
  		<p>{{ type }}</p>\
  		<p>{{ raw_weight }} Kg</p>\
      <p style='float: right;top: -5em;position: relative;'>{{ status }}</p>\
  		<div class='switch'>\
  		  <input type='checkbox' {{#show_collect_button}} checked {{/show_collect_button}}>\
  		  <label  style='left: 2.8em;'>\
  		    <span class='fontawesome-ok'></span>\
  		    <span class='fontawesome-remove'></span>\
  		    <div></div>\
  		  </label>\
  		</div>\
  	</div>\
    {{/.}}", packages);
        }else{
          packages = []
          for(var i = 0; i < result[0].length; i++){
            status_id = result[4][i].toString();
            if(status_id != 0){
              packages.push({id: result[0][i].toString(), type: App.garbage_type[result[1][i].toString()], raw_weight: result[2][i].toString(), recycled_weight: result[3][i].toString(), status: App.statuses[result[4][i].toString()], show_collect_button: !(status_id == '1') });
            }
          }
          var rendered_template = Mustache.render(
      "{{#.}}\
      <div class='alert'>\
  		<i></i> Comunity {{ id}}\
  		<p>{{ type }}</p>\
  		<p>{{ raw_weight }} Kg</p>\
      <p style='float: right;top: -5em;position: relative;'>{{ status }}</p>\
  		<div class='switch' style='left: 4em;'>\
  		  <label>\
  		    <span class='fontawesome-ok'></span>\
  		    <span class='fontawesome-remove'></span>\
  		    <div></div>\
  		  </label>\
  		</div>\
  	</div>\
    {{/.}}", packages);


        }
        console.log("#results" + App.account_type)
        $("#results" + App.accountType).html(rendered_template);
        console.log(rendered_template);
      }).then(function(hasVoted) {
      // Do not allow a user to vote
      if(hasVoted) {
        $('form').hide();
      }
      loader.hide();var candidateId = $('#candidatesSelect').val();
      content.show();
    }).catch(function(error) {
      console.warn(error);
    });
  },

  collectPackage: function(package_id) {
    var candidateId = $('#candidatesSelect').val();
    App.contracts.Recyclers.deployed().then(function(instance) {
      return instance.processPackage(package_id, { from: App.account });
    }).then(function(result) {
      alert("got it");
    }).catch(function(err) {
      console.error(err);
    });
  }
};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
