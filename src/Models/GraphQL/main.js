Parse.Cloud.define("getanEvent", async (request) => {
  console.log('request: ' + request)
  const query = new Parse.Query("Event");
  query.equalTo("name", 'Addis Fashion Week');
  const results = await query.find();
  console.log('results: ' + results)
  return {request, results};
}, {
  requireUser: true
});

Parse.Cloud.define("moveUserRole", async (request) => {
  new Parse.Query(Parse.Role)
    .equalTo('event', Parse.Object.extend('Event').createWithoutData(request.params.eventId))
    .equalTo('users', Parse.User.createWithoutData(request.params.userId))
    .first({useMasterKey: true})
    .then(async value => {
      console.log('role');
      if (value && (value.id !== request.params.newRoleId)) {
        value.getUsers().remove(Parse.User.createWithoutData(request.params.userId));
        await value.save(null, {useMasterKey: true});
      }
    }, reason => {
      console.log('first\n' + reason.message + '\n')
    }).catch(reason => {
    console.log('first\n' + reason.message + '\n')
  });

  new Parse.Query(Parse.Role)
    .get(request.params.newRoleId, {useMasterKey: true})
    .then(async value => {
      value.getUsers().add(Parse.User.createWithoutData(request.params.userId));
      return await value.save(null, {useMasterKey: true});
    }, reason => {
      console.log('second\n' + reason.message + '\n')
    }).catch(reason => {
    console.log('second\n' + reason.message + '\n')
  });
  return user;
});

Parse.Cloud.define("moveUserAccess", async (request) => {
  if (!['4fyRGHaKld', 'qqPYJY1E0i', 'l5fSvNAHmX'].includes(request.params.newRoleId)) {
    return new Parse.Error(101, 'Access Does Not Exist');
  }
  const user = await new Parse.Query(Parse.User).get(request.params.userId, {useMasterKey: true});


  const thisUserAccess = await new Parse.Query(Parse.Role)
    .containedIn('name', ['Owner', 'Manager', 'Staff'])
    .equalTo('users', request.user)
    .first({useMasterKey: true});
  const changingUserRole = await new Parse.Query(Parse.Role)
    .containedIn('name', ['Owner', 'Manager', 'Staff'])
    .equalTo('users', user).first({useMasterKey: true});
  if ((thisUserAccess.id === 'qqPYJY1E0i' && request.params.newRoleId === 'l5fSvNAHmX') ||
    (thisUserAccess.id === 'qqPYJY1E0i' && changingUserRole.id === 'l5fSvNAHmX')
    || (thisUserAccess.id === '4fyRGHaKld')) {
    throw new Parse.Error(206, 'Insufficent Auth');
  }
  const newACL = new Parse.ACL();
  newACL.setPublicReadAccess(true);
  newACL.setReadAccess(user, true);
  newACL.setWriteAccess(user, true);
  newACL.setRoleWriteAccess('Owner', true);
  newACL.setRoleReadAccess('Owner', true);
  if (request.params.newRoleId !== 'l5fSvNAHmX') {
    newACL.setRoleWriteAccess('Manager', true);
    newACL.setRoleReadAccess('Manager', true);
  }
  user.setACL(newACL);
  user.save(null, {useMasterKey: true});

  new Parse.Query(Parse.Role)
    .containedIn('name', ['Owner', 'Manager', 'Staff'])
    .equalTo('users', user)
    .first({useMasterKey: true})
    .then(async value => {
      if (value && (value.id !== request.params.newRoleId)) {
        value.getUsers().remove(Parse.User.createWithoutData(request.params.userId));
        await value.save(null, {useMasterKey: true});
      }
    }, reason => {
      console.log('first\n' + reason.message + '\n')
    }).catch(reason => {
    console.log('first\n' + reason.message + '\n')
  });

  new Parse.Query(Parse.Role)
    .get(request.params.newRoleId, {useMasterKey: true})
    .then(async value => {
      value.getUsers().add(Parse.User.createWithoutData(request.params.userId));
      return await value.save(null, {useMasterKey: true});
    }, reason => {
      console.log('second\n' + reason.message + '\n')
    }).catch(reason => {
    console.log('second\n' + reason.message + '\n')
  });
  return user;
}, {
  requireUser: true
});

Parse.Cloud.define("moveBoardCard", async (request) => {
  const listId = request.params.listId;
  const newPreviousId = request.params.newPreviousId ? request.params.newPreviousId : undefined;
  const newNextId = request.params.newNextId ? request.params.newNextId : undefined;
  const itemId = request.params.itemId;
  let newPreviousItem = undefined;
  if (newPreviousId)
    newPreviousItem = await new Parse.Query(Parse.Object.extend('ListCard')).get(newPreviousId);
  let newNextItem = undefined;
  if (newNextId)
    newNextItem = await new Parse.Query(Parse.Object.extend('ListCard')).get(newNextId);

  const item = await new Parse.Query(Parse.Object.extend('ListCard')).get(itemId);
  item.set('boardList', Parse.Object.extend('BoardList').createWithoutData(listId))
  let prevPos = 0;
  if (newPreviousItem) {
    prevPos = newPreviousItem.get('sortOrder')
  }
  let newPos = 0;
  let nextPos = 0;
  if (newNextItem) {
    nextPos = newNextItem.get('sortOrder')
  }
  if (prevPos === 0 && nextPos === 0) {
    const list = await new Parse.Query(Parse.Object.extend('ListCard'))
      .ascending('sortOrder')
      .equalTo('boardList', Parse.Object.extend('BoardList').createWithoutData(listId)).find();
    if (list.length < 1)
      newPos = 65536; // this is the only element
    else {
      await Parse.Cloud.run("moveBoardCard", {listId, itemId, newPreviousId: list[list.length - 1].id, newNextId})
      return true;
    }
  } else if (nextPos === 0) {
    newPos = (prevPos + 65537) / 2; //there is no next element
  } else {
    newPos = (prevPos + nextPos) / 2; // find the average; works even if there is no previous element (prevPos==0)
  }
  item.set('sortOrder', newPos)
  await item.save();

  //reset sort order if it is in the decimals
  if (Math.abs(nextPos - newPos) < 0.5 || Math.abs(prevPos - newPos) < 0.5 ||
    prevPos > 65537 || Math.abs(prevPos - newPos) < 0.5) {
    await Parse.Cloud.run("resortBoardCard", {listId})
  }
  return true;
});

Parse.Cloud.define("resortBoardCard", async (request) => {
  const listId = request.params.listId;
  const list = await new Parse.Query(Parse.Object.extend('ListCard'))
    .equalTo('boardList', Parse.Object.extend('BoardList').createWithoutData(listId)).find();
  list.sort((a, b) => a.get('sortOrder') > b.get('sortOrder') ? 1 : -1)
  for (const item of list) {
    let i = list.indexOf(item);
    item.set('sortOrder', (65536 * (i + 1) / list.length))
    await item.save();
  }
});

Parse.Cloud.define("moveCardChecklist", async (request) => {
  const listId = request.params.listId;
  const newPreviousId = request.params.newPreviousId ? request.params.newPreviousId : undefined;
  const newNextId = request.params.newNextId ? request.params.newNextId : undefined;
  const itemId = request.params.itemId;
  let newPreviousItem = undefined;
  if (newPreviousId)
    newPreviousItem = await new Parse.Query(Parse.Object.extend('CardChecklist')).get(newPreviousId);
  let newNextItem = undefined;
  if (newNextId)
    newNextItem = await new Parse.Query(Parse.Object.extend('CardChecklist')).get(newNextId);

  const item = await new Parse.Query(Parse.Object.extend('CardChecklist')).get(itemId);
  item.set('card', Parse.Object.extend('ListCard').createWithoutData(listId))
  let prevPos = 0;
  if (newPreviousItem) {
    prevPos = newPreviousItem.get('sortOrder')
  }
  let newPos = 0;
  let nextPos = 0;
  if (newNextItem) {
    nextPos = newNextItem.get('sortOrder')
  }
  if (prevPos === 0 && nextPos === 0) {
    const list = await new Parse.Query(Parse.Object.extend('CardChecklist'))
      .ascending('sortOrder')
      .equalTo('card', Parse.Object.extend('ListCard').createWithoutData(listId)).find();
    if (list.length < 1)
      newPos = 65536; // this is the only element
    else {
      await Parse.Cloud.run("moveCardChecklist", {listId, itemId, newPreviousId: list[list.length - 1].id, newNextId})
      return true;
    }
  } else if (nextPos === 0) {
    newPos = (prevPos + 65537) / 2; //there is no next element
  } else {
    newPos = (prevPos + nextPos) / 2; // find the average; works even if there is no previous element (prevPos==0)
  }
  item.set('sortOrder', newPos)
  await item.save();

  //reset sort order if it is in the decimals
  if (Math.abs(nextPos - newPos) < 0.5 || Math.abs(prevPos - newPos) < 0.5 ||
    prevPos > 65537 || Math.abs(prevPos - newPos) < 0.5) {
    await Parse.Cloud.run("resortCardChecklist", {listId})
  }
  return true;
});

Parse.Cloud.define("resortCardChecklist", async (request) => {
  const listId = request.params.listId;
  const list = await new Parse.Query(Parse.Object.extend('CardChecklist'))
    .equalTo('card', Parse.Object.extend('ListCard').createWithoutData(listId)).find();
  list.sort((a, b) => a.get('sortOrder') > b.get('sortOrder') ? 1 : -1)
  for (const item of list) {
    let i = list.indexOf(item);
    item.set('sortOrder', (65536 * (i + 1) / list.length))
    await item.save();
  }
});

Parse.Cloud.define("moveCardChecklistItem", async (request) => {
  const listId = request.params.listId;
  const newPreviousId = request.params.newPreviousId ? request.params.newPreviousId : undefined;
  const newNextId = request.params.newNextId ? request.params.newNextId : undefined;
  const itemId = request.params.itemId;
  let newPreviousItem = undefined;
  if (newPreviousId)
    newPreviousItem = await new Parse.Query(Parse.Object.extend('CardChecklistItem')).get(newPreviousId);
  let newNextItem = undefined;
  if (newNextId)
    newNextItem = await new Parse.Query(Parse.Object.extend('CardChecklistItem')).get(newNextId);

  const item = await new Parse.Query(Parse.Object.extend('CardChecklistItem')).get(itemId);
  item.set('checklist', Parse.Object.extend('CardChecklist').createWithoutData(listId))
  let prevPos = 0;
  if (newPreviousItem) {
    prevPos = newPreviousItem.get('sortOrder')
  }
  let newPos = 0;
  let nextPos = 0;
  if (newNextItem) {
    nextPos = newNextItem.get('sortOrder')
  }
  if (prevPos === 0 && nextPos === 0) {
    const list = await new Parse.Query(Parse.Object.extend('CardChecklistItem'))
      .ascending('sortOrder')
      .equalTo('checklist', Parse.Object.extend('CardChecklist').createWithoutData(listId)).find();
    if (list.length < 1)
      newPos = 65536; // this is the only element
    else {
      await Parse.Cloud.run("moveCardChecklistItem", {
        listId,
        itemId,
        newPreviousId: list[list.length - 1].id,
        newNextId
      })
      return true;
    }
  } else if (nextPos === 0) {
    newPos = (prevPos + 65537) / 2; //there is no next element
  } else {
    newPos = (prevPos + nextPos) / 2; // find the average; works even if there is no previous element (prevPos==0)
  }
  item.set('sortOrder', newPos)
  await item.save();

  //reset sort order if it is in the decimals
  if (Math.abs(nextPos - newPos) < 0.5 || Math.abs(prevPos - newPos) < 0.5 ||
    prevPos > 65537 || Math.abs(prevPos - newPos) < 0.5) {
    await Parse.Cloud.run("resortCardChecklistItem", {listId})
  }
  return true;
});

Parse.Cloud.define("resortCardChecklistItem", async (request) => {
  const listId = request.params.listId;
  const list = await new Parse.Query(Parse.Object.extend('CardChecklistItem'))
    .equalTo('checklist', Parse.Object.extend('CardChecklist').createWithoutData(listId)).find();
  list.sort((a, b) => a.get('sortOrder') > b.get('sortOrder') ? 1 : -1)
  for (const item of list) {
    let i = list.indexOf(item);
    item.set('sortOrder', (65536 * (i + 1) / list.length))
    await item.save();
  }
});

Parse.Cloud.define("moveBoardList", async (request) => {
  const newPreviousId = request.params.newPreviousId ? request.params.newPreviousId : undefined;
  const newNextId = request.params.newNextId ? request.params.newNextId : undefined;
  const itemId = request.params.itemId;
  let newPreviousItem = undefined;
  if (newPreviousId)
    newPreviousItem = await new Parse.Query(Parse.Object.extend('BoardList')).get(newPreviousId);
  let newNextItem = undefined;
  if (newNextId)
    newNextItem = await new Parse.Query(Parse.Object.extend('BoardList')).get(newNextId);

  const item = await new Parse.Query(Parse.Object.extend('BoardList')).get(itemId);
  let prevPos = 0;
  if (newPreviousItem) {
    prevPos = newPreviousItem.get('sortOrder')
  }
  let newPos = 0;
  let nextPos = 0;
  if (newNextItem) {
    nextPos = newNextItem.get('sortOrder')
  }
  if (prevPos === 0 && nextPos === 0) {
    const list = await new Parse.Query(Parse.Object.extend('BoardList'))
      .ascending('sortOrder')
      .equalTo('event', Parse.Object.extend('Event').createWithoutData(item.get('event').id)).find();
    if (list.length < 1)
      newPos = 65536; // this is the only element
    else {
      console.log()
      await Parse.Cloud.run("moveBoardList", {itemId, newPreviousId: list[list.length - 1].id, newNextId})
      return true;
    }
  } else if (nextPos === 0) {
    newPos = (prevPos + 65537) / 2; //there is no next element
  } else {
    newPos = (prevPos + nextPos) / 2; // find the average; works even if there is no previous element (prevPos==0)
  }
  item.set('sortOrder', newPos)
  await item.save();

  //reset sort order if it is in the decimals
  if (Math.abs(nextPos - newPos) < 0.5 || Math.abs(prevPos - newPos) < 0.5 ||
    prevPos > 65537 || Math.abs(prevPos - newPos) < 0.5) {
    await Parse.Cloud.run("resortBoardList", {eventId: item.get('event').id})
  }
  return true;
});

Parse.Cloud.define("resortBoardList", async (request) => {
  const eventId = request.params.eventId;
  const list = await new Parse.Query(Parse.Object.extend('BoardList'))
    .equalTo('event', Parse.Object.extend('Event').createWithoutData(eventId)).find();
  list.sort((a, b) => a.get('sortOrder') > b.get('sortOrder') ? 1 : -1)
  for (const item of list) {
    let i = list.indexOf(item);
    item.set('sortOrder', (65536 * (i + 1) / list.length))
    await item.save();
  }
});

Parse.Cloud.afterSave('CardChecklist', async (request) => {
  if (request.object.get('sortOrder') === undefined || request.object.get('sortOrder') === null) {
    await Parse.Cloud.run("moveCardChecklist", {listId: request.object.get('card').id, itemId: request.object.id})
  }
});

Parse.Cloud.afterSave('CardChecklistItem', async (request) => {
  if (request.object.get('sortOrder') === undefined || request.object.get('sortOrder') === null) {
    await Parse.Cloud.run("moveCardChecklistItem", {
      listId: request.object.get('checklist').id,
      itemId: request.object.id
    })
  }
});

Parse.Cloud.afterSave('ListCard', async (request) => {
  if (request.object.get('sortOrder') === undefined || request.object.get('sortOrder') === null) {
    await Parse.Cloud.run("moveBoardCard", {listId: request.object.get('boardList').id, itemId: request.object.id})
  }
});

Parse.Cloud.afterSave('BoardList', async (request) => {
  if (request.object.get('sortOrder') === undefined || request.object.get('sortOrder') === null) {
    await Parse.Cloud.run("moveBoardList", {itemId: request.object.id})
  }
});
Parse.Cloud.afterSave('_Role', async (request) => {
  let role = {};
  let roleEnum = {};
  let event = {};
  if (['4fyRGHaKld', 'qqPYJY1E0i', 'l5fSvNAHmX'].includes(request.object.id)) {
    return null;
  }
  await new Parse.Query(Parse.Role).includeAll().get(request.object.id, {useMasterKey: true})
    .then(async value => {
      role = value;
      console.log('role');
      console.log('\n' + value + '\n');
    }, reason => {
      console.log('\n ' + reason.message + '\n');
    }).catch(reason => {
      console.log('\n ' + reason.message + '\n');
    });
  let roleACL = role.getACL();
  let roleUpdated = false;
  let ownerRole = roleACL.getRoleReadAccess('Owner');
  if (!ownerRole) {
    roleUpdated = true;
    roleACL.setRoleReadAccess(role, true);
    roleACL.setWriteAccess(request.user, true);
    roleACL.setReadAccess(request.user, true);
    roleACL.setRoleReadAccess('Owner', true);
    roleACL.setRoleWriteAccess('Owner', true);
  }
  const fetchedRoles = await new Parse.Query(Parse.Role)
    .equalTo('event', role.get('event'))
    .includeAll()
    .find({useMasterKey: true});

  for (const aRole of fetchedRoles) {
    if (aRole.getACL().getRoleWriteAccess(role.get('name')) !== role.get('roleEnum').get('roleReadWrite')) {
      aRole.getACL().setRoleReadAccess(role.get('name'), true);
      aRole.getACL().setRoleWriteAccess(role.get('name'), role.get('roleEnum').get('roleReadWrite'));
      await aRole.save(null, {useMasterKey: true});
    }
  }
  if (roleUpdated) {
    request.object.setACL(roleACL);
    await request.object.save(null, {useMasterKey: true});
  }

  await new Parse.Query(Parse.Object.extend('Roles')).includeAll()
    .get(role.get('roleEnum').id, {useMasterKey: true})
    .then(value => {
      roleEnum = value;
      console.log('RoleEnum');
      console.log('\n' + value + '\n');
    }, reason => {
      console.log('\n ' + reason.message + '\n');
    }).catch(reason => {
      console.log('\n ' + reason.message + '\n');
    });
  await new Parse.Query(Parse.Object.extend('Event')).includeAll()
    .get(role.get('event').id, {useMasterKey: true}).then(value => {
      event = value;
      console.log('main event');
      console.log('\n' + value + '\n');
    }, reason => {
      console.log('\n ' + reason.message + '\n');
    }).catch(reason => {
      console.log('\n ' + reason.message + '\n');
    });

  let eventACL = event.getACL();
  console.log();
  eventACL.setRoleReadAccess(role.get('name'), roleEnum.get('eventRead'));
  eventACL.setRoleWriteAccess(role.get('name'), roleEnum.get('eventWrite'));
  event.setACL(eventACL);
  await event.save(null, {useMasterKey: true});


  let orders = [];
  await event.relation('orders').query().find({useMasterKey: true}).then(value => {
    orders = value;
    console.log('order');
    console.log('\n' + value + '\n');
  }, reason => {
    console.log('\n ' + reason.message + '\n');
  });
  for (const order of orders) {
    let orderACL = order.getACL();
    orderACL.setRoleReadAccess(role.get('name'), roleEnum.get('orderRead'));
    orderACL.setRoleWriteAccess(role.get('name'), roleEnum.get('orderWrite'));
    order.setACL(orderACL);
    await order.save(null, {useMasterKey: true});
    const ticketOrders = await order.relation('orderedTickets').query().find({useMasterKey: true});
    for (const ticketOrder of ticketOrders) {
      let ticketOrderACL = ticketOrder.getACL();
      ticketOrderACL.setRoleReadAccess(role.get('name'), roleEnum.get('orderRead'));
      ticketOrderACL.setRoleWriteAccess(role.get('name'), roleEnum.get('orderWrite'));
      ticketOrder.setACL(ticketOrderACL);
      await ticketOrder.save(null, {useMasterKey: true});
    }
  }
  console.log('\n ');
}, {
  requireUser: true
});

Parse.Cloud.afterSave('Event', async (request) => {
  let eventACL = request.object.getACL();
  if (!eventACL) {
    eventACL = new Parse.ACL();
    eventACL.setWriteAccess(request.user, true);
    eventACL.setReadAccess(request.user, true);
    await request.object.save(null, {useMasterKey: true});
    const newConfirmationTemplate = new (Parse.Object.extend('Email'))();
    newConfirmationTemplate.set('event', request.object);
    newConfirmationTemplate.set('isScheduled', false);
    await newConfirmationTemplate.save();
    const newReminderTemplate = new (Parse.Object.extend('Email'))();
    newReminderTemplate.set('event', request.object);
    newReminderTemplate.set('isScheduled', true);
    await newReminderTemplate.save();
    request.object.set('reminderEmail', newReminderTemplate);
    request.object.set('confirmationEmail', newConfirmationTemplate);
    await request.object.save();
  }
  let ownerRole = eventACL.getRoleReadAccess('Owner');
  if (!ownerRole) {
    eventACL.setRoleReadAccess('Owner', true);
    eventACL.setRoleWriteAccess('Owner', true);
    request.object.setACL(eventACL);
    await request.object.save(null, {useMasterKey: true});
  }
}, {
  requireUser: true
});

Parse.Cloud.afterSave('Order', async (request) => {
  const order = await new Parse.Query(Parse.Object.extend('Order'))
    .include('event').include('event.createdBy')
    .get(request.object.id, {useMasterKey: true});
  const createdBy = order.get('event').get('createdBy');
  const event = order.get('event');

  let orderACL = request.object.getACL();
  if (!orderACL) {
    orderACL = new Parse.ACL();
    orderACL.setWriteAccess(createdBy, true);
    orderACL.setReadAccess(createdBy, true);
    request.object.setACL(orderACL);
    await request.object.save(null, {useMasterKey: true});
  }

  let ownerRole = orderACL.getRoleReadAccess('Owner');
  if (!ownerRole) {
    orderACL.setRoleReadAccess('Owner', true);
    orderACL.setRoleWriteAccess('Owner', true);
    const roles = await new Parse.Query(Parse.Role)
      .equalTo('event', event)
      .includeAll()
      .find({useMasterKey: true});

    roles.forEach(role => {
      orderACL.setRoleReadAccess(role, role.get('roleEnum').get('orderRead'));
      orderACL.setRoleWriteAccess(role, role.get('roleEnum').get('orderWrite'))
    })
    request.object.setACL(orderACL);
    await request.object.save(null, {useMasterKey: true});
  }
}, {
  requireUser: true
});

Parse.Cloud.afterSave('TicketOrder', async (request) => {
  const ticketOrder = await new Parse.Query(Parse.Object.extend('TicketOrder'))
    .include('ticketType').include('ticketType.event').include('ticketType.event.createdBy')
    .get(request.object.id, {useMasterKey: true});
  const createdBy = ticketOrder.get('ticketType').get('event').get('createdBy');
  const event = ticketOrder.get('ticketType').get('event');

  let ticketOrderACL = request.object.getACL();
  if (!ticketOrderACL) {
    ticketOrderACL = new Parse.ACL();
    ticketOrderACL.setWriteAccess(createdBy, true);
    ticketOrderACL.setReadAccess(createdBy, true);
    request.object.setACL(ticketOrderACL);
    await request.object.save(null, {useMasterKey: true});
  }

  let ownerRole = ticketOrderACL.getRoleReadAccess('Owner');
  if (!ownerRole) {
    ticketOrderACL.setRoleReadAccess('Owner', true);
    ticketOrderACL.setRoleWriteAccess('Owner', true);
    const roles = await new Parse.Query(Parse.Role)
      .equalTo('event', event)
      .includeAll()
      .find({useMasterKey: true});
    roles.forEach(role => {
      ticketOrderACL.setRoleReadAccess(role, role.get('roleEnum').get('orderRead'));
      ticketOrderACL.setRoleWriteAccess(role, role.get('roleEnum').get('orderWrite'))
    })
    request.object.setACL(ticketOrderACL);
    await request.object.save(null, {useMasterKey: true});
  }
}, {
  requireUser: true
});

Parse.Cloud.define('deleteUserProfile', async (request) => {
  const user = await request.user.fetch({useMasterKey: true})
  const file = user.get('profileImg');
  user.set('profileImg', null);
  await user.save(null, {useMasterKey: true});
  await file.destroy({useMasterKey: true});
});

Parse.Cloud.define('sendEmail', async (request) => {
  const to = request.params.to;
  const subject = request.params.subject;
  const body = request.params.body;

  Parse.Cloud.httpRequest({
    method: 'POST',
    url: 'http://localhost:3000/sendEmail',
    body: {
      to: to,
      body: body,
      subject: subject
    }
  }).then(function (httpResponse) {
  }, function (httpResponse) {
    console.error('Request failed with response code ' + httpResponse.status);
  });
});

