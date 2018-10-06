Recyclers.at("0x3a5036bd4e6c176de2703cca73367622fac4501c").getPackages().then(function(result){for(var i = 0; i < result[0].length; i++){ console.log("id:" + result[0][i].toString() + " type:" + result[1][i].toString() + " raw_weight:" + result[2][i].toString() + " recycled_weight:" + result[3][i].toString() + "  status:" + result[4][i].toString()); }});


Recyclers.at("0x590adec6f409d4bf1e8eb0c33def59eb9898712e").addNewPackage (2,3,5, {from: web3.eth.accounts[0] });
