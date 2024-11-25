// == Feature == View friend list changes
if(W.g_steamID != W.g_rgProfileData.steamid) return; // not our profile

const storageKey = 'swt_friends_'+W.g_steamID;

function saveFriends(friendsArray){
    if(friendsArray)
        localStorage[storageKey] = friendsArray;
    localStorage[storageKey+'_t'] = Date.now();
}

function getFriends(){
    let $friends = $J('.friend_block_v2')

    let friendsArray = new Array($friends.length);
    $friends.each((i, el)=>{
        let $el = $J(el);
        friendsArray[i] = //need string
            $el.attr('data-miniprofile') ||
            $el.attr('id').split('_')[1] // if profile can't be loaded
    })

    return {friendsArray, $friends}
}

let frVchangesBtn = $J(`<button class="profile_friends manage_link btnv6_blue_hoverfade btn_medium"><span>(<b></b>) ${t('frVchanges')}</span></button>`)
.insertAfter('#manage_friends_control')
.click(function(){

    var {friendsArray, $friends} = getFriends();

    var changed;

    let friendsArray_old = localStorage[storageKey].split(',');

    let removed = $J(friendsArray_old).not(friendsArray).get();

    var str=`<div class="state_block"><h1>🔙 ${(new Date(parseInt(localStorage[storageKey+'_t']))).toLocaleString()}</h1><h1>${t('frRemoved')}</h1></div>`;
    if(removed.length){
        changed=true;

        for(let i=0, n=removed.length; i<n; ++i){
            str +=
            `<div class="friend_block_v2 persona" id="fr_${removed[i]}" data-miniprofile="${removed[i]}">
                <a class="selectable_overlay" href="/profiles/[U:1:${removed[i]}]"></a>
                <div class="player_avatar friend_block_link_overlay"><img src="//avatars${CDN}fef49e7fa7e1997310d705b2a6158ff8dc1cdfeb_medium.jpg"></div>
                <div class="friend_block_content">${removed[i]}</div>
            </div>`;
            $J.ajax(`/miniprofile/${removed[i]}/json`).done(data=>{
                let $el=$J('#fr_'+removed[i]);
                $el.find('img').attr('src', data.avatar_url);

                $el.find('.friend_block_content').text(data.persona_name);
            })
        }
    }
    $J('#search_results').prepend(str);

    $friends.hide();
    $J(`<div class="state_block"><h1>${t('frNew')}</h1></div>`).insertAfter(W.search_results_empty)

    let added = $J(friendsArray).not(friendsArray_old).get();

    if(added.length){
        changed=true;

        for(let i=0, n=added.length; i<n; ++i){
            $J('#fr_'+added[i]).show();
        }
    }

    saveFriends(changed && friendsArray)
})

// count diff
if(localStorage[storageKey+'_t']){
    let count = Math.abs(localStorage[storageKey].split(',').length-g_rgCounts.cFriends);
    frVchangesBtn.find('b').append(count)
}
// initial saving
else {
    saveFriends(getFriends().friendsArray)
}
