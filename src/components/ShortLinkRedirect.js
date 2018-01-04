import React from 'react';
import gql from 'graphql-tag';
import {graphql} from 'react-apollo';
import PropTypes from 'prop-types';

const GET_FULL_LINK_QUERY = gql`
    query GetFullLink($hash: String!) {
        allLinks(filter: {hash: $hash}) {
            url
        }
    }
`;

const ShortLinkRedirect = ({hash, data: {loading, error, allLinks}}) => {
  if (error) {
    return <div>Error occurred</div>;
  }
  if (loading) {
    return <div>Loading ...</div>;
  }
  if (!allLinks || allLinks.length !== 1) {
    return <div>No redirect found for '{hash}'</div>;
  }
  window.location = allLinks[0].url;
  return null;
};

ShortLinkRedirect.propTypes = {
  hash: PropTypes.string,
};

export default graphql(GET_FULL_LINK_QUERY, {
  options: ({hash}) => ({variables: {hash}})
})(ShortLinkRedirect);
