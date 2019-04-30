import { List, ListItem } from 'material-ui';
import MenuItem from '/imports/ui/components/MenuItem';

import { IndexLinkContainer } from 'react-router-bootstrap';
import React from 'react';
import { ReactMeteorData } from 'meteor/react-meteor-data';
import ReactMixin from 'react-mixin';

import { get } from 'lodash';

// Pick up any dynamic routes that are specified in packages, and include them
var publicModules = [];
Object.keys(Package).forEach(function(packageName){
  if(Package[packageName].PublicSidebarElements){
    // we try to build up a route from what's specified in the package
    Package[packageName].PublicSidebarElements.forEach(function(element){
      publicModules.push(element);      
    });    
  }
});


export class PublicSidebar extends React.Component {
  getMeteorData() {
    let data = {
      style: {
        position: 'fixed',
        top: '0px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        padding: '0 2.4rem',
        opacity: Session.get('globalOpacity')
      },
      listItem: {
        display: 'inline-block',
        position: 'relative'
      }
    };

    return data;
  }

  render () {

    var index;
    if(get(Meteor, 'settings.public.defaults.sidebar.showIndex')){
      index = <IndexLinkContainer to='/signup'>
        <MenuItem primaryText='Register' href='/signup' />
       </IndexLinkContainer>
    }

    //----------------------------------------------------------------------
    // Public Modules  

    var publicElements = [];
    var publicElementSpacer = false;

    publicModules.map(function(element, index){ 
      // the excludes array will hide routes
      if(!get(Meteor, 'settings.public.defaults.sidebar.hidden', []).includes(element.to)){
        publicElements.push(<IndexLinkContainer to={element.to} key={index}>
          <MenuItem primaryText={element.primaryText} href={element.href} />
        </IndexLinkContainer>);
        publicElementSpacer = true;
      }
    });
    if(publicElementSpacer){
      publicElements.push(<hr key={'hr-' + index} />);
    }

    var registrationLinks;
    var registrationLinksSpacer;
    if(get(Meteor, 'settings.public.home.showRegistration')){
      registrationLinks = <div>
        <IndexLinkContainer to='/signin' key='signin'>
           <MenuItem primaryText='Sign In' href='/signin' />
        </IndexLinkContainer>

        <IndexLinkContainer to='/signup' key='signup'>
           <MenuItem primaryText='Register' href='/signup' />
        </IndexLinkContainer>
      </div>
      registrationLinksSpacer = <hr />
    }
    return(
      <List id='PublicSidebar' style={{paddingLeft: '20px', position: 'static'}}>

        { index }

        { registrationLinks }
        { registrationLinksSpacer }

        { publicElements }

        <IndexLinkContainer to='/about' key='about'>
           <MenuItem primaryText='About' href='/about' />
        </IndexLinkContainer>

        <IndexLinkContainer to='/privacy' key='privacy'>
           <MenuItem primaryText='Privacy Page' href='/privacy' />
        </IndexLinkContainer>

        <IndexLinkContainer to='/terms-and-conditions' key='terms'>
           <MenuItem primaryText='Terms and Conditions' href='/terms-and-conditions' />
        </IndexLinkContainer>

      </List>
    );
  }
}

ReactMixin(PublicSidebar.prototype, ReactMeteorData);
export default PublicSidebar; 