exports(sound_test)

var i
  , sink = Sink()
  , voices = []
  , reverb = audioLib.Reverb(sink.sampleRate, sink.channelCount, 1.0, 0.2, .999)
  , scale =
    new Float32Array([ 130.82
                     , 220
                     , 311.13
                     , 440
                     , 622.25
                     , 880
                     , 1000
                     ])

function sound_test(i) {
  var frequency = scale[~~(scale.length * sine(i * 3.172 * Math.sin(i * 0.2)))]
  voices.push(audioLib.generators.Voice(sink.sampleRate, frequency, sine(i * 4.23)))
}

audioLib.generators('Voice', Voice)
sink.on('audioprocess', audioprocess)

function audioprocess(buffer, channelCount) {
  reverb.append(buffer, channelCount)
  for (i = voices.length; i--;){
    voices[i].append(buffer, channelCount)
    if (! voices[i].samplesLeft) voices.splice(i, 1)
  }
}

function Voice (sampleRate, frequency, pan) {
  _.extend(this,
           { sampleRate: sampleRate
           , frequency:  frequency
           , pan: pan
           , length:  this.length
           },
           { samplesLeft: this.length * sampleRate
           , osc:  audioLib.Oscillator(sampleRate, frequency * 2)
           , lfo: _.extend(audioLib.Oscillator(sampleRate, frequency * 2.8), { waveShape: 'triangle' })
           , envelope: audioLib.ADSREnvelope(sampleRate, 10, 300, 0.6, 4000, 20, this.length * 1000)
           }
          )

  this.envelope.triggerGate()
}

_.extend(Voice.prototype,
         { sample: 0
         , length: 12
         , mix: 0.5
         , generate: function () {
             this.lfo.generate()
             this.osc.fm = this.lfo.getMix()
             this.osc.generate()
             this.envelope.generate()

             this.sample = this.osc.getMix() * this.envelope.getMix()

             if (!--this.samplesLeft) this.generate = function () {}
           }

         , getMix: function (ch) {
             return this.sample * (ch % 2 ? this.pan : 1 - this.pan)
           }
         })
