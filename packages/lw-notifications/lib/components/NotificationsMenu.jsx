import { Components, registerComponent, withCurrentUser, withList, withEdit } from 'meteor/vulcan:core';
import React, { PropTypes, Component } from 'react';
import { FormattedMessage } from 'react-intl';
import { Meteor } from 'meteor/meteor';
import { Dropdown, MenuItem, DropdownButton } from 'react-bootstrap';
import { LinkContainer } from 'react-router-bootstrap';
import Users from 'meteor/vulcan:users';
import { withApollo } from 'react-apollo';
import Notifications from '../collection.js'

//TODO: Clean up this code: Remove unecessary imports, restructure code below to be more readable

class NotificationsMenu extends Component {

  renderNotificationsList() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    const refetch = this.props.refetch;
    const loading = this.props.loading;
    // console.log(currentUser);
    // console.log(refetch);
    if (results && results.length) {
      return (
        <div>
          {results.map(notification => <Components.NotificationsItem key={notification._id} currentUser={currentUser} notification={notification} />)}
        </div>
      )
    } else if (loading) {
        return (<Components.Loading/>)
    } else {
        return (<MenuItem>No Results</MenuItem>)
    }
  }

  render() {
    const results = this.props.results;
    const currentUser = this.props.currentUser;
    let unreadNotifications = [];
    if (results && results.length) {
      unreadNotifications = results.filter(this.isNotViewed);
    }

    if(!currentUser){
      return (<div></div>);
    } else { //TODO: Replace DrodownButton with custom Dropdown component and replace notification count with badge
      return (
        <div className="notifications-menu">
          <DropdownButton id="notification-menu" onClick={() => this.viewNotifications(unreadNotifications)}  bsStyle='info' title={'Notifications (' + unreadNotifications.length + ')'}>
              {this.renderNotificationsList()}
          </DropdownButton>
        </div>
      )
    }
  }


  isNotViewed(notification) {
    return (!notification.viewed);
  };

  viewNotifications(results) {
    if(results && results.length && this.props){
      let editMutation = this.props.editMutation;
      let set = {viewed: true};
      results.forEach(function(notification) {
        editMutation({documentId: notification._id, set: set, unset: {}});
      });
    }
  };

}

NotificationsMenu.propsTypes = {
  currentUser: React.PropTypes.object,
  client: React.PropTypes.object,
};

const withListOptions = {
  collection: Notifications,
  queryName: 'notificationsListQuery',
  fragmentName: 'notificationsNavFragment',
  limit: 5,
};

const withEditOptions = {
  collection: Notifications,
  fragmentName: 'notificationsNavFragment',
};


registerComponent('NotificationsMenu', NotificationsMenu, withList(withListOptions), withEdit(withEditOptions), withCurrentUser);
