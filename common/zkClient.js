var zookeeper = require('node-zookeeper-client');
var constants = require('../constants');

var client = zookeeper.createClient(constants.zookeeperHost);

exports.create = function (nodePath) {

    client.create(nodePath,
        function (error, path) {
            if (error) {
                console.log(error.stack);
                return;
            }
            console.log('Node: %s is created.', path);
        });

};


function isExists(nodePath){

    client.exists(nodePath, function (error, stat) {
        if (error) {
            console.log(error.stack);
            return;
        }

        if (stat) {
            console.log('Node exists.');
            return true;
        } else {
            console.log('Node does not exist.');
            return false;
        }
    });
}

exports.setData = function (nodePath,data) {

    client.setData(nodePath, data, -1, function (error, stat) {
        if (error) {
            console.log(error.stack);
            return;
        }

        console.log('Data is set.');
    });

};

exports.remove = function (nodePath) {

    client.remove(nodePath, -1, function (error) {
        if (error) {
            console.log(error.stack);
            return;
        }

        console.log('Node is deleted.');
    });


};

exports.getData=function(path){

    client.getData(
        path,
        function (event) {
            console.log('Got event: %s.', event);
        },
        function (error, data, stat) {
            if (error) {
                console.log(error.stack);
                return;
            }

            console.log('Got data: %s', data.toString('utf8'));
            console.log('Got stat: %s', JSON.stringify(stat));
        }
    );


    client.close();

}

client.connect();
