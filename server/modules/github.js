let gs = require('github-scraper'),
    _ = require('lodash'),
    Promise = require('bluebird');

let gsAsync = Promise.promisify(gs);

class Github {

    constructor (user = '') {
        this.user = user;
    }

    static getProfile (user) {
        return gsAsync(user);
    }

    getUsersWithAvatars (type = 'followers') {
        let sampleList = [];

        return gsAsync(`${this.user}/${type}`)
            .then((list) => {
                sampleList = _.sample(list.entries, 10);
                return sampleList;
            })
            .then((followers) => {
                return followers.map((follower) => {
                    return Github.getProfile(follower).catch((e)=> {
                        console.log('B');
                        console.log(e);
                    });
                })
            }).then(function (followerData) {
                return Promise.all(followerData)
                    .then((profiles) => {
                        return profiles.map((profile) => {
                            return _.get(profile, 'avatar', '');
                        });
                    });
            }).then(function (avatars) {
                return _.zip(sampleList, avatars);
            });
    }

    static getRepoIssues (repo) {
        return gsAsync(`${repo}/issues`).catch((e)=> {
            console.log('A');
            console.log(e);
        });
    }

    getStarredRepositoriesWithIssues () {
        let repos = [];
        return gsAsync(`stars/${this.user}`).then(function (list) {
            repos = _.sample(list.entries, 10);
            return repos;
        }).then(function (repos) {
            let promises = repos.map((repo) => {
                return Github.getRepoIssues(repo).catch((e)=> {
                    console.log('D');
                    console.log(e);
                });
            });
            return Promise.all(promises)
                .then((results) => {
                    return _.compact(results);
                })
                .catch((e)=> {
                    console.log('C');
                    console.log(e);
                });
        });
    }

    getPersonalRepositories () {
        return gsAsync(`${this.user}?tab=repositories`).then(function (list) {
            return list.entries;
        }).catch((e)=> {
            console.log('E');
            console.log(e);
        });
    }

    getAllInfo () {
        let labels = [
            'profile',
            'followersWithAvatar',
            'followingWithAvatar',
            'starredRepositoriesWithIssues',
            'personalRepositories'
        ];
        let promises = [
            Github.getProfile(this.user),
            this.getUsersWithAvatars(),
            this.getUsersWithAvatars('following'),
            this.getStarredRepositoriesWithIssues(),
            this.getPersonalRepositories()
        ];

        return Promise.all(promises).then((results) => {
            return _.zipObject(labels, results);
        }).catch((e) => {
            console.log(e);
        });
    }
}

exports = module.exports = Github;