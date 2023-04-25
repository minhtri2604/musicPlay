const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)
const playlist = $('.playlist')
const cd = $('.cd')
const cdThumb = $('.cd-thumb')
const heading = $('header h2')
const audio = $('#audio')
const nextBtn = $('.btn-next')
const prevBtn = $('.btn-prev')
const randomBtn = $('.btn-random')
const playBtn = $('.btn-toggle-play')
const play = $('.player')
const btnRepeat = $('.btn-repeat')
const currentTime = $('.currentTime')
const timeDuration = $('.timeDuration')
const minutesStar = $('#minutesStar')
const secondStar = $('#secondStar')
const menuIcon = $('menu-icon')
const minutesEnd = $('#minutesEnd')
const secondEnd = $('#secondEnd')
const progress = $('#progress')
const mobileBtn = $('.playlist-check')
const app = {
    isPlaying: false,
    currentIndex: 0,
    isRandom: false,
    isRepeat: false,
    songs: [
        {
            name: "Nevada",
            singer: "Vicetone",
            path: "./asset/music/Vicetone-Nevada-Remix.mp3",
            image: "./asset/img/nevada.jpeg"
        },
        {
            name: "Răng khôn",
            singer: "Phương Anh",
            path: "./asset/music/RangKhon-PhiPhuongAnhTheFaceRIN9-7006388.mp3",
            image: "./asset/img/rangkhon.jpeg"
        },
        {
            name: "Cô đơn trên sofa",
            singer: "Trung Quân",
            path: "./asset/music/cô-đơn-trên-sofa.mp3",
            image: "./asset/img/tq.jpeg"
        },
        {
            name: "I do",
            singer: "911",
            path: "./asset/music/I-Do-911.mp3",
            image: "./asset/img/ido.jpeg"
        },

        {
            name: "chơi vơi",
            singer: "Táo",
            path: "./asset/music/choivoi.mp3",
            image: "./asset/img/choivoi.jpeg"
        },
        {
            name: "La La La",
            singer: "saqira",
            path: "./asset/music/lala.mp3",
            image: "./asset/img/lalala.jpeg"
        },
        {
            name: "ABCDEFU",
            singer: "GAYLE",
            path: "./asset/music/abcdefu.mp3",
            image: "./asset/img/abcdefu.jpeg"
        },
        {
            name: "Head in the cloud",
            singer: "HayD",
            path: "./asset/music/head.mp3",
            image: "./asset/img/head.jpeg"
        }
    ],
    render: function () {
        const htmls = this.songs.map((song, index) => {
            return ` 
            <div class="song ${index === this.currentIndex ? "active" : ""}" data-index="${index}">
                <div class="thumb"
                    style="background-image: url('${song.image}')">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        playlist.innerHTML = htmls.join('');

    },
    defineProperties: function () {
        Object.defineProperty(this, 'currentSong', {
            get: function () {
                return this.songs[this.currentIndex]
            }
        })
    },
    handlEvents: function () {
        const _this = this
        const cdWidth = cd.offsetWidth


        const cdThumbs = cdThumb.animate([
            { transform: "rotate(360deg)" }
        ], {
            duration: 10000,
            interations: Infinity
        })
        cdThumbs.pause()
        // Thu màn hình nhỏ lại khi scroll
        document.onscroll = function () {
            const scrollTop = document.documentElement.scrollTop || window.scrollY

            const newWidth = cdWidth - scrollTop

            cd.style.width = newWidth > 0 ? newWidth + 'px' : 0
            cd.style.opacity = newWidth / cdWidth
        },

        // Play và Pause
        playBtn.onclick = function () {
            if (_this.isPlaying) {
                audio.pause()

            } else {

                audio.play()
            }
            audio.ontimeupdate = function () {
                const timeDuration = audio.duration;
                if (timeDuration) {
                    const progressPercent = Math.floor(audio.currentTime * 100 / timeDuration);
                    progress.value = progressPercent;
                }
                minutesStar.innerText = Math.floor(audio.currentTime / 60).toLocaleString().padStart(2, "0");
                secondStar.innerText = Math.floor(audio.currentTime % 60).toLocaleString().padStart(2, "0");


            }
            progress.onchange = function (e) {
                const progresChange = (e.target.value * audio.duration / 100)

                audio.currentTime = progresChange


            }
        }
        audio.onloadedmetadata = function () {

            minutesEnd.innerText = Math.floor(audio.duration / 60).toLocaleString().padStart(2, "0");
            secondEnd.innerText = Math.round(audio.duration % 60).toLocaleString().padStart(2, "0");

            minutesStar.innerText = Math.floor(audio.currentTime / 60).toLocaleString().padStart(2, "0");
            secondStar.innerText = Math.floor(audio.currentTime % 60).toLocaleString().padStart(2, "0");
        }

        audio.onplay = function () {

            _this.isPlaying = true
            play.classList.add('playing')
            cdThumbs.play()
        }
        audio.onpause = function () {

            _this.isPlaying = false

            play.classList.remove('playing')
            cdThumbs.pause()
        }
        nextBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.nextSong()
            }
            audio.play()
            _this.render()
            _this.scrollInterview()

        }

        prevBtn.onclick = function () {
            if (_this.isRandom) {
                _this.playRandomSong()
            } else {
                _this.prevSong()
            }
            audio.play()
            _this.render()
            _this.scrollInterview()

        }
        randomBtn.onclick = function (e) {
            _this.isRandom = !_this.isRandom
            randomBtn.classList.toggle('active', _this.isRandom)

        }




        btnRepeat.onclick = function (e) {
            _this.isRepeat = !_this.isRepeat
            btnRepeat.classList.toggle('active', _this.isRepeat)
        }







        audio.onended = function () {
            if (_this.isRepeat) {
                audio.play()
            } else {
                nextBtn.click()
            }
        }
        playlist.onclick = function (e) {
            const songNode = e.target.closest('.song:not(.active)')
            if (e.target.closest('.song:not(.active)') || e.target.closest('.option')) {
                if (songNode) {
                    _this.currentIndex = Number(songNode.getAttribute('data-index'))
                    _this.loadCurrentSong()
                    audio.play()
                    _this.render()

                }
            }
            audio.ontimeupdate = function () {
                const timeDuration = audio.duration;
                if (timeDuration) {
                    const progressPercent = Math.floor(audio.currentTime * 100 / timeDuration);
                    progress.value = progressPercent;
                }
                minutesEnd.innerHTML = Math.floor(timeDuration / 60)
                secondEnd.innerHTML = Math.floor(timeDuration % 60)
                minutesStar.innerText = Math.floor(audio.currentTime / 60).toLocaleString().padStart(2, "0")
                secondStar.innerText = Math.floor(audio.currentTime % 60).toLocaleString().padStart(2, "0")

            }
        }
        mobileBtn.onclick = function () {
            _this.isPlaying = !_this.isPlaying
            playlist.classList.toggle('isShow', _this.isPlaying)
        }

    },

    loadCurrentSong: function () {
        heading.textContent = this.currentSong.name
        cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`
        audio.src = this.currentSong.path


    },
    nextSong: function () {
        this.currentIndex++
        if (this.currentIndex >= this.songs.length) {
            this.currentIndex = 0
        }
        this.loadCurrentSong()
    },
    prevSong: function () {
        this.currentIndex--
        if (this.currentIndex < 0) {
            this.currentIndex = this.songs.length - 1
        }
        this.loadCurrentSong()
    },
    scrollInterview: function () {
        setTimeout(() => {
            $('.song.active').scrollIntoView({
                behavior: "smooth",
                block: "center"
            })
        }, 300)
    },
    playRandomSong: function () {
        let newIndex
        do {
            newIndex = Math.floor(Math.random() * this.songs.length)
        } while (newIndex === this.currentIndex)
        this.currentIndex = newIndex
        this.loadCurrentSong()
    },



    start: function () {
        this.defineProperties()

        this.handlEvents()

        this.loadCurrentSong()

        this.render()

    }
}
app.start()







