
import _ from 'lodash';
import config from 'config';
import util from '../util';

/**
 * Service methods to handle direct project.
 */

/**
 * Build custom http client for request
 * @param {Object} req request
 * @returns {Object} custom http client
 * @private
 */
function getHttpClient(req) {
  const httpClient = util.getHttpClient(req);
  httpClient.defaults.headers.common.Authorization = req.headers.authorization;
  httpClient.defaults.headers.common['Content-Type'] = 'application/json';
  httpClient.defaults.baseURL = config.get('directProjectServiceEndpoint');
  httpClient.defaults.timeout = _.get(config, 'directProjectServiceTimeout', 5000);
  httpClient.interceptors.response.use((resp) => {
    // req.log.debug('resp: ', JSON.stringify(resp.data, null, 2))
    if (resp.status !== 200 || resp.data.result.status !== 200) {
      req.log.error('error resp: ', JSON.stringify(resp.data, null, 2));
      return Promise.reject(new Error(resp.data.result.content.message));
    }
    return Promise.resolve(resp);
  });
  return httpClient;
}

export default {
  /**
   * Create direct project
   * @param {Object} req request
   * @param {Object} body the body contains project information
   * @returns {Promise} create direct project promise
   */
  createDirectProject: (req, body) => getHttpClient(req)
  .post('/projects/', body),

  /**
   * Add direct project copilot
   * @param {Object} req request
   * @param {Object} directProjectId the id of direct project
   * @param {Object} body the body contains project copilot information
   * @returns {Promise} add pilot promise
   */
  addCopilot: (req, directProjectId, body) => getHttpClient(req)
    .post(`/projects/${directProjectId}/copilot`, body),

  /**
   * Remove direct project copilot
   * @param {Object} req the request
   * @param {Integer} directProjectId the id of direct project
   * @param {Object} body the body contains project copilot information
   * @returns {Promise} response promise
   */
  deleteCopilot: (req, directProjectId, body) => getHttpClient(req)
    .delete(`/projects/${directProjectId}/copilot`, body),

  /**
   * Add billing account for direct project
   * @param {Object} req the request
   * @param {String} directProjectId the id of direct project
   * @param {Object} body the body contains billing account information
   * @returns {Promise} add billing account promise
   */
  addBillingAccount: (req, directProjectId, body) => getHttpClient(req)
    .post(`/projects/${directProjectId}/billingaccount`, body),

  /**
   * Add/remove direct project permissions
   * This can be used to add/remove direct project manager
   * @param {Object} req the request
   * @param {Integer} directProjectId the id of direct project
   * @param {Object} body the body contains permissions information
   * @returns {Promise} promise
   */
  editProjectPermissions: (req, directProjectId, body) => getHttpClient(req)
    .post(`/projects/${directProjectId}/permissions`, body),
};
