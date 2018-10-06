//comunidades - Comunity
//  - Entrega (+ tokens)
//recicladoras - Recycler
//  - Bloquea entrega
//supervisor - Supervisor
//  - Verifica salida
//tokens
//co2_conversor
//materials

pragma solidity ^0.4.24;

contract Recyclers {

  event ClaimReward(address comunity_id, uint balance);

  enum PackageStates { Waiting, Processing, Delivered, Confirmed }

  // await recycler.addComunity("Comunity1", accounts[0]);
  //  await recycler.addRecycler("Business1", accounts[1]);
  //  await recycler.addSupervisor("Supervisor1", accounts[2]);
  struct Package {
    uint id;
    uint type_id;
    uint raw_weight;
    uint recycled_weight;
    address comunity_id;
    address recycler_id;
    address supervisor_id;
    PackageStates status;
  }

  struct Comunity{
    bytes32 name;
    address id;
    uint balance;
    bool exist;
  }

  struct Recycler{
    bytes32 name;
    address id;
    bool exist;
  }

  struct Supervisor{
    bytes32 name;
    address id;
    bool exist;
  }

  uint[] private _packagesIds;

  constructor () public {


  }

  mapping(uint => Package) public shipments;
  mapping(address => Comunity) public comunities;
  mapping(address => Recycler) public recyclers;
  mapping(address => Supervisor) public supervisors;

  function addRecycler (bytes32 _name, address _address) public {
    recyclers[_address] = Recycler(_name, _address, true);
  }

  function addSupervisor (bytes32 _name, address _address) public {
    supervisors[_address] = Supervisor(_name, _address, true);
  }

  function addComunity (bytes32 _name, address _address) public {
    comunities[_address] = Comunity(_name, _address, 0, true);
  }

  function addNewPackageFactory (  uint id, uint type_id, uint raw_weight, address comunity_id) public {
    Package memory newPackage;
    newPackage.id = id;
    newPackage.type_id = type_id;
    newPackage.raw_weight = raw_weight;
    newPackage.status = PackageStates.Waiting;
    newPackage.comunity_id = comunity_id;
    shipments[id] = newPackage;
    _packagesIds.push(id);
  }

  function addNewPackage (  uint id, uint type_id, uint raw_weight) public {
    Package memory newPackage;
    newPackage.id = id;
    newPackage.type_id = type_id;
    newPackage.raw_weight = raw_weight;
    newPackage.status = PackageStates.Waiting;
    newPackage.comunity_id = msg.sender;
    shipments[id] = newPackage;
    _packagesIds.push(id);
    emit ClaimReward(msg.sender, 2);
  }

  function processPackage( uint package_id) public{
    shipments[package_id].recycler_id = msg.sender;
    shipments[package_id].status = PackageStates.Processing;
  }

  function deliverPackage( uint package_id, uint recycled_weight) public{
    //require(msg.sender == shipments[package_id].recycler_id);

    shipments[package_id].recycled_weight = recycled_weight;
    shipments[package_id].status = PackageStates.Delivered;
  }

  function confirmPackage( uint package_id) public{
    shipments[package_id].supervisor_id = msg.sender;
    shipments[package_id].status = PackageStates.Confirmed;
    comunities[shipments[package_id].comunity_id].balance = comunities[shipments[package_id].comunity_id].balance + 10;
  }

  function getPackages() public constant returns( uint[], uint[], uint[], uint[], uint[]  ) {
    uint[] memory package_ids = new uint[](_packagesIds.length);
    uint[] memory package_types = new uint[](_packagesIds.length);
    uint[] memory package_raw_weight = new uint[](_packagesIds.length);
    uint[] memory package_recycled_weight = new uint[](_packagesIds.length);
    uint[] memory package_status = new uint[](_packagesIds.length);
    for (uint i = 0; i < _packagesIds.length; i++) {
      package_ids[i] = shipments[_packagesIds[i]].id;
      package_types[i] = shipments[_packagesIds[i]].id;
      package_raw_weight[i] = shipments[_packagesIds[i]].raw_weight;
      package_recycled_weight[i] = shipments[_packagesIds[i]].recycled_weight;
      package_status[i] = uint(shipments[_packagesIds[i]].status);
    }
    return (package_ids, package_types, package_raw_weight, package_recycled_weight, package_status);
  }

  function claimReward() public{
    var balance = comunities[msg.sender].balance;
    comunities[msg.sender].balance = 0;
    emit ClaimReward(msg.sender, balance);
  }



}
