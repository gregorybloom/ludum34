
GAMESOUNDS={

	audioContext: null,
  buffers: null,

  audioComponents: null,

	musicSource: null,
	audioElement: null,
	playing: false,
	musicOn: false,
  volume: 0.4,

	gameSFX:[]
};

//	https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/Using_HTML5_audio_and_video

GAMESOUNDS.init = function()
{
  GAMESOUNDS.audioContext = GAMEMUSIC.audioContext;
  GAMESOUNDS.load();
	GAMESOUNDS.loadSounds( GAMESOUNDS.audioContext );
    /*  API changed, disabling Music for now */
//	this.toggleMusic();

	return true;
};
GAMESOUNDS.load = function() {
};
GAMESOUNDS.loadSounds = function(context) {
  var ctx = this;
  var loader = new BufferLoader(context, this.gameSFX, onLoaded);
  function onLoaded(buffers) {
    ctx.buffers = buffers;
  }
  loader.load();
};
GAMESOUNDS.makeSource = function(type,vol) {
  if(GAMEMUSIC.mute)    return;
  var source = GAMESOUNDS.audioContext.createBufferSource();
  var compressor = GAMESOUNDS.audioContext.createDynamicsCompressor();
  var gain = GAMESOUNDS.audioContext.createGain();
  var v = vol* GAMEMUSIC.volume *1.45;
  if(v > 1) v=1;
  gain.gain.value = v;
  if(GAMESOUNDS.buffers==null)    return null;
  source.buffer = GAMESOUNDS.buffers[type];
  source.connect(gain);
  gain.connect(compressor);
  compressor.connect(GAMESOUNDS.audioContext.destination);
  return source;
};



