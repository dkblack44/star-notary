const StarNotary = artifacts.require("StarNotary");

module.exports = function(deployer) {
  deployer.deploy(StarNotary, "DBStar", "DBSTR", 1000);
};
