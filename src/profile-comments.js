var comments = Object.values(g_rgCommentThreads)[0];
if(!comments) return; // TODO check likes



comments.m_voteupID = 'swt_btnLikeProfile';
comments.m_votecountID = 'swt_countProfLikes';

var $commentthread = $J('div.commentthread_area');

$commentthread.prepend(`
    <span id="${comments.m_votecountID}">${comments.m_cUpVotes} ${t('prLiked')}</span>
    <a id="${comments.m_voteupID}" onclick="CCommentThread.VoteUp('${comments.m_strName}')" class="btn_grey_grey btn_small_thin ico_hover">
    <span><i class="ico16 thumb_up"></i> like this profile</span></a>
`);


if(comments.m_bLoadingUserHasUpVoted) {
    $J($(comments.m_voteupID)).addClass('active')
}
