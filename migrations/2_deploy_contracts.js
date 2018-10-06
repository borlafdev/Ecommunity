//explicado
var Recyclers = artifacts.require("./Recyclers.sol");





module.exports = (deployer, enviroment, accounts ) => {
  deployer.then(async () => {

    const recycler = await deployer.deploy(Recyclers);
    console.log('Recycler created: ', recycler.address);

    await recycler.addComunity("Comunity1", accounts[1]);
    await recycler.addRecycler("Business1", accounts[2]);
    await recycler.addSupervisor("Supervisor1", accounts[3]);

    await recycler.addNewPackage (1, 2, 25);
    await recycler.addNewPackage (2, 1, 40);
    await recycler.addNewPackage (3, 3, 10);


    console.log('END');
  })
}
