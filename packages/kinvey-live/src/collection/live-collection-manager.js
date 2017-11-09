const { Client } = require('kinvey-client');
const { KinveyError } = require('kinvey-errors');
const { KinveyRequest, RequestMethod } = require('kinvey-request');
const { getLiveService, isValidReceiver, isValidChannelName } = require('../live-service');

class LiveCollectionManager {
  /**
   * @param {Client} client
   */
  constructor(client) {
    this._client = client || Client.sharedInstance();
  }

  subscribeCollection(name, receiver) {
    if (!isValidChannelName(name)) {
      return Promise.reject(new KinveyError('Invalid or missing collection name'));
    }

    if (!isValidReceiver(receiver)) {
      return Promise.reject(new KinveyError('Invalid or missing receiver'));
    }

    return this._makeSubscriptionRequest(name, '_subscribe')
      .then(() => {
        const channelName = this._buildChannelName(name);
        getLiveService().subscribeToChannel(channelName, receiver);
      });
  }

  unsubscribeCollection(name) {
    if (!isValidChannelName(name)) {
      return Promise.reject(new KinveyError('Invalid or missing collection name'));
    }

    return this._makeSubscriptionRequest(name, '_unsubscribe')
      .then(() => {
        const channelName = this._buildChannelName(name);
        getLiveService().unsubscribeFromChannel(channelName);
      });
  }

  /**
   * Builds the expected channel name, used when receiving messages from PubNub
   * @private
   * @param {string} collectionName
   */
  _buildChannelName(collectionName) {
    return `${this._client.appKey}.c-${collectionName}`;
  }

  /**
   * @private
   * @param {string} collectionName
   * @param {string} path
   */
  _makeSubscriptionRequest(collectionName, path) {
    return KinveyRequest.executeShort({
      method: RequestMethod.POST,
      pathname: `/appdata/${this._client.appKey}/${collectionName}/${path}`,
      body: { deviceId: this._client.deviceId }
    });
  }
}
exports.LiveCollectionManager = LiveCollectionManager;

/** @type {LiveCollectionManager} */
let managerInstance;

/**
 * @param {Client} client
 */
function getLiveCollectionManager(client) {
  if (!managerInstance) {
    managerInstance = new LiveCollectionManager(client);
  }
  return managerInstance;
}
exports.getLiveCollectionManager = getLiveCollectionManager;
