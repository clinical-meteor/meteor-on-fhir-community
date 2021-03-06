import { Accounts } from 'meteor/accounts-base';
import { Meteor } from 'meteor/meteor';

Meteor.methods({
  transferPatient: function(patientReference, receivingUser){    
    check(patientReference, Object);
    check(receivingUser, Object);

    console.log('transferPatient', patientReference, receivingUser);

    Meteor.users.update({_id: receivingUser.reference}, {
        $set: {
            'profile.incomingPatient': patientReference
        }
    }, function(error){
        if(error){
        console.log('error', error)
        }
    })
  },
  sendNotificationToUser: function(message, detail, userId){    
    check(message, String);
    check(detail, String);
    check(userId, Match.Maybe(String));

    if(!userId){
      userId = Meteor.userId();
    }
    console.log('sendNotificationToUser', userId);

    Meteor.users.update({_id: userId}, {
      $push: {
        'profile.notifications': {
            primaryText: message,
            secondaryText: detail
        }
      }
    }, function(error){
      if(error){
        console.log('error', error)
      }
    })
  },
  clearUserNotifications: function(userId){
    check(userId, Match.Maybe(String));

    if(!userId){
      userId = Meteor.userId();
    }
    console.log('sendNotificationToUser', userId);

    Meteor.users.update({_id: userId}, {
      $unset: {
        'profile.notifications': []
      }
    }, function(error){
      if(error){
        console.log('error', error)
      }
    })
  },
  removeSpecificNotification: function(message, userId){
    check(message, String);
    check(userId, Match.Maybe(String));

    if(!userId){
      userId = Meteor.userId();
    }
    console.log('removeSpecificNotification', message);

    Meteor.users.update({_id: userId}, {
      $pull: {
        'profile.notifications': {
          primaryText: message
        }
      }
    }, {multi: true}, function(error){
      if(error){
        console.log('error', error)
      }
    })
  },
  sendInboxMessage: function(userId){
    console.log('sendInboxMessage', userId);
    Meteor.users.update({_id: userId}, {$set: {
      'profile.inbox': true
    }});
  }
});
