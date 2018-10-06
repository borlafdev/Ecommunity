//se indica el contrato al que se le pasan los tests
var Election = artifacts.require("./Election.sol");

contract("Election", function(accounts) {
  var electionInstance;

  it("se inicializa con 3 equipos", function() {
    return Election.deployed().then(function(instance) {
      return instance.candidatesCount();
    }).then(function(count) {
      assert.equal(count, 3);
    });
  });

  it("Se inicializan los equipos con los parametros correctos", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.candidates(1);
    }).then(function(candidate) {
      assert.equal(candidate[0], 1, "contiene el id correcto");
      assert.equal(candidate[1], "Equipo 1", "contiene el nombre correcto");
      assert.equal(candidate[2], 0, "contiene el numero correcto de votos");
      return electionInstance.candidates(2);
    }).then(function(candidate) {
      assert.equal(candidate[0], 2, "contiene el id correcto");
      assert.equal(candidate[1], "Equipo 2", "contiene el nombre correcto");
      assert.equal(candidate[2], 0, "contiene el numero correcto de votos");
      return electionInstance.candidates(3);
    }).then(function(candidate) {
      assert.equal(candidate[0], 3, "contiene el id correcto");
      assert.equal(candidate[1], "Equipo 3", "contiene el nombre correcto");
      assert.equal(candidate[2], 0, "contiene el numero correcto de votos");
    });
  });

  it("permite al votante emitir el voto", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 1;
      return electionInstance.vote(candidateId, { from: accounts[0] });
    }).then(function(receipt) {
      assert.equal(receipt.logs.length, 1, "un evento ha sido capturado");
      assert.equal(receipt.logs[0].event, "votedEvent", "es el evento correcto");
      return electionInstance.voters(accounts[0]);
    }).then(function(voted) {
      assert(voted, "el votante ha sido marcado como votado");
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "incrementa el recuento de votos del candidato");
    })
  });

  it("lanza una excepcion para candidatos invalidos", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      return electionInstance.vote(99, { from: accounts[1] })
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "el candidato 1 no ha recibido ningun voto");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "el candidato 2 no ha recibido ningun voto");
      return electionInstance.candidates(3);
    }).then(function(candidate3) {
      var voteCount = candidate3[2];
      assert.equal(voteCount, 0, "el candidato 3 no ha recibido ningun voto");
    });
  });

  it("lanza una excepción para votaciones dobles", function() {
    return Election.deployed().then(function(instance) {
      electionInstance = instance;
      candidateId = 2;
      electionInstance.vote(candidateId, { from: accounts[1] });
      return electionInstance.candidates(candidateId);
    }).then(function(candidate) {
      var voteCount = candidate[2];
      assert.equal(voteCount, 1, "acepta el primer voto");
      // Try to vote again
      return electionInstance.vote(candidateId, { from: accounts[1] });
    }).then(assert.fail).catch(function(error) {
      assert(error.message.indexOf('revert') >= 0, "error message must contain revert");
      return electionInstance.candidates(1);
    }).then(function(candidate1) {
      var voteCount = candidate1[2];
      assert.equal(voteCount, 1, "el candidato 1 no ha recibido ningun voto");
      return electionInstance.candidates(2);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 1, "el candidato 2 no ha recibido ningun voto");
      return electionInstance.candidates(3);
    }).then(function(candidate2) {
      var voteCount = candidate2[2];
      assert.equal(voteCount, 0, "el candidato 3 no ha recibido ningun voto");
    });
  });
});
