import events from 'events';

/**
 * HOW TO USE
 *
 * This is an eventBus in its simplest form.
 *
 * In file A import and register an event listener:
 *   import eventBus from '@/utils/eventBus';
 *   eventBus.on('eventName', function () {
 *    console.log('triggered!');
 *   });
 *
 * In file B import and fire the event:
 *   import eventBus from '@/utils/eventBus';
 *   eventBus.emit('eventName');
 *
 * That's it.
 *
 * NB: You can also register and trigger the event within the same file.
 * Extend this util as you please.
 */

const emitter = new events.EventEmitter();
emitter.on('uncaughtException', (err: any) => {
  console.error(err);
});

export default emitter;
