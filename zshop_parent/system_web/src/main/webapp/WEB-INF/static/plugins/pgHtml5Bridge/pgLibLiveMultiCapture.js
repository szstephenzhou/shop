/*************************************************************************
  copyright   : Copyright (C) 2014-2017, www.peergine.com, All rights reserved.
              :
  filename    : pgLibLiveMultiCapture.js
  discription : 
  modify      : create, chenbichao, 2017/04/01

*************************************************************************/


function pgLibLiveMultiCapture(oAtx, oUI)
{
	// Check peergine Activex object
	if (!oAtx || typeof(oAtx.Control) == "undefined") {
		alert("pgLibLiveMulti: oAtx is invalid.");
		return null;
	}

	// Check callback object.
	if (!oUI || typeof(oUI.OnEvent) != "function") {
		alert("pgLibLiveMulti: oUI is invalid.");
		return null;
	}


	///------------------------------------------------------------------------------
	// API methods.

	this.Initialize = function(sUser, sPass, sSvrAddr, sRelayAddr, iP2PTryTime, sInitParam) {

		if (sUser == null || sPass == null || sSvrAddr == null || sRelayAddr == null || sInitParam == null) {
			this._OutString("pgLibLiveMultiCapture.Initialize: sUser, sPass, sSvrAddr, sRelayAddr, sInitParam is null");
			return pgErrCode.PG_ERR_BadParam;
		}

		if (sUser == "" || sSvrAddr == "") {
			this._OutString("pgLibLiveMultiCapture.Initialize: User or SvrAddr is ''");
			return pgErrCode.PG_ERR_BadParam;
		}

		// Find empty live unit. 
		var iLiveInd = -1;
		for (var i = 0; i < _pgLiveMultiCallback.aLiveList.length; i++) {
			if (!_pgLiveMultiCallback.aLiveList[i]) {
				iLiveInd = i;
				break;
			}
		}
		if (iLiveInd < 0) {
			this._OutString("pgLibLiveMultiCapture.Initialize: No empty live instance unit.");
			return pgErrCode.PG_ERR_NoSpace;
		}

		// Attach to live list.
		_pgLiveMultiCallback.aLiveList[iLiveInd] = this;
		this._iInd = iLiveInd;

		// Version
		this._LIVE_VER = "11";

		// Init status.
		this._sObjSvr = "";
		this._sObjSelf = "";

		this._bStarted = false;
		this._bLogin = false;
		this._bSingleMode = false;
		this._bReportPeerInfo = true;

		this._sListRender = "";
		this._sListVideo = "";
		this._sListAudio = "";
		this._sListFile = "";
		this._sObjRenEnum = "";

		this._sInitSvrName = "pgConnectSvr";
		this._sInitSvrAddr = sSvrAddr;

		// Store parameters.
		this._sUser = sUser;
		this._sPass = sPass;
		this._sSvrAddr = sSvrAddr;
		this._sRelayAddr = sRelayAddr;
		this._iP2PTryTime = iP2PTryTime;

		this._sDevID = sUser;
		this._sObjSelf = ("_CAP_" + this._sDevID);

		this._InitPrivate(sInitParam);

		var iErr = this._NodeStart(sInitParam);
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.Initialize: Node start failed.");
			return iErr;
		}

		return pgErrCode.PG_ERR_Normal;
	}

	this.Clean = function() {
		this._NodeStop();

		if (this._iInd >= 0) {
			_pgLiveMultiCallback.aLiveList[this._iInd] = null;
			this._iInd = -1;
		}

		this._sListRender = "";
		this._sListVideo = "";
		this._sListAudio = "";
		this._sListFile = "";

		this._sDevID = "";
		this._sObjSvr = "";
		this._sObjSelf = "";
		this._sSvrAddr = "";
		this._sRelayAddr = "";
	}

	this.GetSelfPeer = function() {
		return this._sObjSelf;
	}


	//------------------------------------------------------
	// Render handle functions.

	this.RenderReject = function(sRenID) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		return this._RenderReject(sRenID, 0);
	}

	this.RenderAccess = function(sRenID, bVideo, bAudio) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sObjRender = this._RenderBuildObject(sRenID);
		var iCtrl = bVideo ? 1 : 0;
		var sData = "(Class){PG_CLASS_Video}(Ctrl){" + iCtrl + "}";
		var iErr = this._oAtx.ObjectRequest(sObjRender, 48, sData, "pgLibLiveMultiCapture.RenderAccess");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			return iErr;
		}
		
		iCtrl = bAudio ? 1 : 0;
		sData = "(Class){PG_CLASS_Audio}(Ctrl){" + iCtrl + "}";
		iErr = this._oAtx.ObjectRequest(sObjRender, 48, sData, "pgLibLiveMultiCapture.RenderAccess");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			return iErr;
		}

		return iErr;
	}

	this.RenderEnum = function(iIndex) {
		if (!this._bStarted) {
			return "";
		}
		
		return this._RenderListEnum(iIndex);
	}


	//------------------------------------------------------
	// Message transfer functions.

	// Send notify at capture side.
	this.NotifySend = function(sData) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sObjData = this._DataBuildObject();
		return this._oAtx.ObjectRequest(sObjData, 32, sData, "pgLibLiveMultiCapture.NotifySend");
	}

	// Send message at capture side or render side
	this.MessageSend = function(sRenID, sData) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sDataMsg = "Msg?" + sData;
		var sObjRender = this._RenderBuildObject(sRenID);
		return this._oAtx.ObjectRequest(sObjRender, 36, sDataMsg, "pgLibLiveMultiCapture.MessageSend");
	}

	//------------------------------------------------------
	// Video handle functions.

	this.VideoModeSize = function(iMode, iWidth, iHeight) {
		if (this._iInd < 0) {
			this._OutString("pgLibLiveMultiCapture.VideoModeSize: Not initialize");						
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._oAtx.ObjectAdd("_vTemp", "PG_CLASS_Video", "", 0x0)) {
			return pgErrCode.PG_ERR_System;
		}

		var sValue = "(Mode){" + iMode + "}(Width){" + iWidth + "}(Height){" + iHeight + "}";
		var sData = "(Item){12}(Value){" + this._oAtx.omlEncode(sValue) + "}";
		var iErr = this._oAtx.ObjectRequest("_vTemp", 2, sData, "");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.VideoModeSize: iErr=" + iErr);	
		}

		this._oAtx.ObjectDelete("_vTemp");
		return iErr;
	}

	// Start and stop video
	this.VideoStart = function(iVideoID, sParam, sViewDiv) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sWndEle = "";
		if (sViewDiv != "") {
			sWndEle = this._oAtx.WndCreate(sViewDiv);
		}
		if (sWndEle == "") {
			return pgErrCode.PG_ERR_BadParam;
		}

		// Check video parameters.
		this._OutString("pgLibLiveMultiCapture.VideoStart: iVideoID=" + iVideoID + ", sParam=" + sParam);

		var sCode = this._oAtx.omlGetContent(sParam, "Code");
		var sMode = this._oAtx.omlGetContent(sParam, "Mode");
		if (this._ParseInt(sCode, 0) < 1 || this._ParseInt(sCode, 0) > 4) {
			this._OutString("pgLibLiveMultiCapture.VideoStart: Invalid code: " + sCode);
			return pgErrCode.PG_ERR_BadParam;
		}
		if (this._ParseInt(sMode, 0) < 0 || this._ParseInt(sMode, 0) > 12) {
			this._OutString("pgLibLiveMultiCapture.VideoStart: Invalid mode: " + sMode);
			return pgErrCode.PG_ERR_BadParam;
		}

		if (this._VideoListExist(iVideoID)) {
			return pgErrCode.PG_ERR_Normal;
		}

		this._VideoListAdd(iVideoID);
		this._VideoListSet(iVideoID, "Param", sParam);
		this._VideoListSet(iVideoID, "Wnd", sWndEle);

		var iErr = this._VideoInit(iVideoID, true);
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._VideoListDelete(iVideoID);
			return iErr;
		}

		return iErr;
	}

	this.VideoStop = function(iVideoID) {
		if (!this._bStarted) {
			return;
		}

		if (this._VideoListExist(iVideoID)) {
			this._VideoClean(iVideoID, true);
			this._ForwardRequest(iVideoID, 1, "", false);
		}

		this._VideoListDelete(iVideoID);
	}

	this.VideoCamera = function(iVideoID, sJpgPath) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._VideoListExist(iVideoID)) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sPathTemp = sJpgPath;
		if (sPathTemp.lastIndexOf(".jpg") < 0
			&& sPathTemp.lastIndexOf(".JPG") < 0)
		{
			sPathTemp += ".jpg";
		}

		var sData = "(Path){" + this._oAtx.omlEncode(sPathTemp) + "}";
		var sObjLive = this._VideoBuildObject(iVideoID);
		var iErr = this._oAtx.ObjectRequest(sObjLive, 37, sData, "pgLibLiveMultiCapture.VideoCamera");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.VideoCamera: iErr=" + iErr);
		}

		return iErr;
	}

	this.VideoParam = function(iVideoID, sParam) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._VideoListExist(iVideoID)) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		this._OutString("pgLibLiveMultiCapture.VideoParam: sParam=" + sParam);						

		var sOldParam = this._VideoListGet(iVideoID, "Param");
		var iOldCode = this._VideoGetParamItem(sOldParam, "Code");
		var iOldMode = this._VideoGetParamItem(sOldParam, "Mode");
		var iOldRate = this._VideoGetParamItem(sOldParam, "Rate");
		var iOldCameraNo = this._VideoGetParamItem(sOldParam, "CameraNo");
		var iOldBitRate = this._VideoGetParamItem(sOldParam, "BitRate");
		var iOldMaxStream = this._VideoGetParamItem(sOldParam, "MaxStream");
		var iOldPortrait = this._VideoGetParamItem(sOldParam, "Portrait");

		var iCode = this._VideoSelectParamItem(sParam, sOldParam, "Code");
		var iMode = this._VideoSelectParamItem(sParam, sOldParam, "Mode");
		var iRate = this._VideoSelectParamItem(sParam, sOldParam, "Rate");
		var iCameraNo = this._VideoSelectParamItem(sParam, sOldParam, "CameraNo");
		var iBitRate = this._VideoSelectParamItem(sParam, sOldParam, "BitRate");
		var iMaxStream = this._VideoSelectParamItem(sParam, sOldParam, "MaxStream");

		// Build new param.
		var sParamTemp = "";
		if (iCode >= 0) {
			sParamTemp += "(Code){" + iCode + "}";
		}
		if (iMode >= 0) {
			sParamTemp += "(Mode){" + iMode + "}";
		}
		if (iRate >= 0) {
			sParamTemp += "(Rate){" + iRate + "}";
		}
		if (iCameraNo >= 0) {
			sParamTemp += "(CameraNo){" + iCameraNo + "}";
		}
		if (iBitRate >= 0) {
			sParamTemp += "(BitRate){" + iBitRate + "}";
		}
		if (iMaxStream >= 0) {
			sParamTemp += "(MaxStream){" + iMaxStream + "}";
		}
		if (iOldPortrait >= 0) {
			sParamTemp += "(Portrait){" + iOldPortrait + "}";
		}

		this._OutString("pgLibLiveMultiCapture.VideoParam: sParamTemp=" + sParamTemp);

		var iErr = pgErrCode.PG_ERR_Normal;
		if ((iCode >= 0 && iCode != iOldCode)
			|| (iMode >= 0 && iMode != iOldMode)
			|| (iRate >= 0 && iRate != iOldRate)
			|| (iCameraNo >= 0 && iCameraNo != iOldCameraNo)
			|| (iBitRate >= 0 && iBitRate != iOldBitRate)
			|| (iMaxStream >= 0 && iMaxStream != iOldMaxStream))
		{
			do {
				var bPreview = false;

				if (this._bStarted && this._VideoListExist(iVideoID)) {
					bPreview = (iMode >= 0 && iMode != iOldMode)
						|| (iCameraNo >= 0 && iCameraNo != iOldCameraNo);
					this._VideoClean(iVideoID, bPreview);
				}

				if ((iCameraNo >= 0 && iCameraNo != iOldCameraNo)
					|| (iBitRate >= 0 && iBitRate != iOldBitRate)
					|| (iRate >= 0 && iRate != iOldRate))
				{
					iErr = this._VideoOption(iVideoID, sParam);
					if (iErr > pgErrCode.PG_ERR_Normal) {
						this._OutString("pgLibLiveMultiCapture.VideoParam: set video option failed. iErr=" + iErr);
						break;
					}
				}

				this._VideoListSet(iVideoID, "Param", sParamTemp);
				if (this._bStarted && this._VideoListExist(iVideoID)) {
					iErr = this._VideoInit(iVideoID, bPreview);
					if (iErr > pgErrCode.PG_ERR_Normal) {
						this._OutString("pgLibLiveMultiCapture.VideoParam: Video init failed. iErr=" + iErr);
						break;
					}
				}
			}
			while (false);
		}
		else {
			this._VideoListSet(iVideoID, "Param", sParamTemp);
		}

		return iErr;
	}

	this.VideoForwardAlloc = function(iVideoID, sParam) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._VideoListExist(iVideoID)) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		return this._ForwardRequest(iVideoID, 1, sParam, true);
	}

	this.VideoForwardFree = function(iVideoID, sParam) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._VideoListExist(iVideoID)) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		return this._ForwardRequest(iVideoID, 1, sParam, false);
	}


	//------------------------------------------------------
	// Audio handle functions.

	// Start and stop audio
	this.AudioStart = function(iAudioID, sParam) {
		if (!this._bStarted) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (this._AudioListExist(iAudioID)) {
			return pgErrCode.PG_ERR_Normal;
		}

		this._AudioListAdd(iAudioID);
		this._AudioListSet(iAudioID, "Param", sParam);

		var iErr = this._AudioInit(iAudioID, sParam);
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._AudioListDelete(iAudioID);
			return iErr;
		}

		return iErr;
	}

	this.AudioStop = function(iAudioID) {
		if (!this._bStarted) {
			return;
		}

		if (this._AudioListExist(iAudioID)) {
			this._AudioClean(iAudioID);
		//	this._ForwardRequest(iAudioID, 0, "", false);
		}

		this._AudioListDelete(iAudioID);
	}

	this.AudioSpeech = function(iAudioID, sRenID, bEnable) {
		if (!this._bStarted) {
			this._OutString("pgLibLiveMultiCapture.AudioSpeech: Not initialize");
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._AudioListExist(iAudioID)) {
			return pgErrCode.PG_ERR_BadStatus;
		}

		var iEnable = bEnable ? 1 : 0;
		var sObjRender = this._RenderBuildObject(sRenID);
		var sData = "(Peer){" + sObjRender + "}(ActSelf){" + iEnable + "}(ActPeer){1}";
		var sObjAudio = this._AudioBuildObject(iAudioID);
		var iErr = this._oAtx.ObjectRequest(sObjAudio, 36, sData, "pgLibLiveMultiCapture.AudioSpeech");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.AudioSpeech: Set audio speech, iErr=" + iErr);
		}

		return iErr;
	}
	
	this.AudioParam = function(iAudioID, sParam) {
		if (!this._bStarted) {
			this._OutString("pgLibLiveMultiCapture.AudioParam: Not initialize");
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._AudioListExist(iAudioID)) {
			this._OutString("pgLibLiveMultiCapture.AudioMute: Not audio start!");
			return pgErrCode.PG_ERR_BadStatus;
		}

		this._AudioListSet(iAudioID, "Param", sParam);

		var sReliable = this._oAtx.omlGetContent(sParam, "Reliable");
		if (sReliable == "") {
			return pgErrCode.PG_ERR_Normal;
		}

		var iReliable = this._ParseInt(sReliable, 0);
		var sData = "(Item){8}(Value){" + iReliable + "}";
		var sObjAudio = this._AudioBuildObject(iAudioID);
		var iErr = this._oAtx.ObjectRequest(sObjAudio, 2, sData, "pgLibLiveMultiCapture.AudioParam");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.AudioParam: Set audio param, iErr=" + iErr);
			return iErr;
		}

		return pgErrCode.PG_ERR_Normal;
	}

	this.AudioMute = function(iAudioID, bInput, bOutput) {
		if (!this._bStarted) {
			this._OutString("pgLibLiveMultiRender.AudioMute: Not initialize");						
			return pgErrCode.PG_ERR_BadStatus;
		}

		if (!this._AudioListExist(iAudioID)) {
			this._OutString("pgLibLiveMultiRender.AudioMute: Not audio start!");
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sObjAudio = this._AudioBuildObject(iAudioID);

		var iMuteInput = bInput ? 1 : 0;
		var sData = "(Item){12}(Value){" + iMuteInput + "}";
		var iErr = this._oAtx.ObjectRequest(sObjAudio, 2, sData, "pgLibLiveMultiCapture.AudioMute");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.AudioMute: set input mute. iErr=" + iErr);
			return iErr;					
		}

		var iMuteOutput = bOutput ? 1 : 0;
		sData = "(Item){13}(Value){" + iMuteOutput + "}";
		iErr = this._oAtx.ObjectRequest(sObjAudio, 2, sData, "pgLibLiveMultiCapture.AudioMute");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.AudioMute: set output mute. iErr=" + iErr);						
			return iErr;					
		}

		return pgErrCode.PG_ERR_Normal;
	}


	//------------------------------------------------------
	// Server handle functions.

	this.SvrRequest = function(sData, sParam) {
		if (!this._bStarted) {
			this._OutString("pgLibLiveMultiCapture.SvrRequest: Not initialize");						
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sDataReq = ("1024:" + sData);
		var sParamReq = ("LIVE_SVR_REQ:" + sParam);
		var iErr = this._oAtx.ObjectRequest(this._sObjSvr, 35, sDataReq, sParamReq);
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture.SvrRequest: iErr=" + iErr);			
		}

		return iErr;
	}


	//------------------------------------------------------
	// File transfer functions.

	this.FilePutRequest = function(sRenID, sPath, sPeerPath) {
		return this._FileRequest(sRenID, sPath, sPeerPath, 32);
	}

	this.FileGetRequest = function(sRenID, sPath, sPeerPath) {
		return this._FileRequest(sRenID, sPath, sPeerPath, 33);
	}

	this.FileAccept = function(sRenID, sPath) {
		return this._FileReply(pgErrCode.PG_ERR_Normal, sRenID, sPath);
	}

	this.FileReject = function(sRenID, iErrCode) {
		var iErrTemp = (iErrCode > pgErrCode.PG_ERR_Normal) ? iErrCode : pgErrCode.PG_ERR_Reject;
		return this._FileReply(iErrTemp, sRenID, "");
	}

	this.FileCancel = function(sRenID) {
		return this._FileCancel(sRenID);
	}
	
	this.Version = function() {
		var sVersion = "";
		var sVerTemp = this._oAtx.omlGetContent(this._oAtx.utilCmd("Version", ""), "Version");
		if (sVerTemp.length > 1) {
			sVersion = sVerTemp.substring(1);
		}
		return (sVersion + "." + this._LIVE_VER);
	}


	///------------------------------------------------------------------------
	// Private member variables.

	// Store ActiveX object and UI callback object.
	this._oAtx = oAtx;
	this._oUI = oUI;
	this._iInd = -1;

	// Store init parameters
	this._sUser = "";
	this._sPass = "";
	this._sSvrAddr = "";
	this._sRelayAddr = "";
	this._iP2PTryTime = 0;

	this._sObjRenEnum = "";

	// Server parameters
	this._sInitSvrName = "pgConnectSvr";
	this._sInitSvrAddr = "";

	// Status members.
	this._sObjSvr = "";
	this._sObjSelf = "";
	this._bStarted = false;
	this._bLogin = false;
	this._sDevID = "";
	this._bSingleMode = false;
	this._bReportPeerInfo = true;


	///---------------------------------------------------------------------------------
	// Private methods.
	
	//------------------------------------------------------
	// Common functions.

	this._ParseInt = function(sVal, idefVal) {
		try {
			if (sVal != "") {
				return parseInt(sVal);
			}
			return idefVal;
		}
		catch (e) {
			return idefVal;
		}
	}

	this._OutString = function(sStr) {
		if (this._oUI.OnOutString && typeof(this._oUI.OnOutString) == "function") {
			this._oUI.OnOutString(sStr);
		}
	}


	//------------------------------------------------------
	// Callback functions.

	this._OnEvent = function(sAct, sData, sRenID) {
		if (this._oUI.OnEvent && typeof(this._oUI.OnEvent) == "function") {
			this._oUI.OnEvent(sAct, sData, sRenID);
		}
	}

	this._OnTimer = function(sExec) {
	}

	this._OnTimeout = function(sExec) {
		var sAct = this._oAtx.omlGetContent(sExec, "Act");
		if (sAct == "TimerActive") {
			this._TimerActive();
		}
		else if (sAct == "Relogin") {
			this._NodeLogin();
		}
		else if (sAct == "PeerGetInfo") {
			var sPeer = this._oAtx.omlGetContent(sExec, "Peer");
			this._NodePeerGetInfo(sPeer);
		}
	}


	//------------------------------------------------------
	// Node handle functions.

	this._GroupBuildObject = function() {
		if (this._bSingleMode) {
			return ("thisGroup_" + this._sDevID);
		}
		else {
			return ("Group_" + this._sDevID);
		}
	}

	this._GroupObjectIs = function(sObject) {
		if (this._bSingleMode) {
			return (sObject.indexOf("thisGroup_") == 0);
		}
		else {
			return (sObject.indexOf("Group_") == 0);
		}
	}

	this._DataBuildObject = function() {
		if (this._bSingleMode) {
			return ("thisData_" + this._sDevID);
		}
		else {
			return ("Data_" + this._sDevID);
		}
	}

	this._DataObjectIs = function(sObject) {
		if (this._bSingleMode) {
			return (sObject.indexOf("thisData_") == 0);
		}
		else {
			return (sObject.indexOf("Data_") == 0);
		}
	}

	this._NodeStart = function(sInitParam) {
		
		var iBufSize0 = this._ParseInt(this._oAtx.omlGetContent(sInitParam, "BufSize0"), 0);
		var iBufSize1 = this._ParseInt(this._oAtx.omlGetContent(sInitParam, "BufSize1"), 0);
		var iBufSize2 = this._ParseInt(this._oAtx.omlGetContent(sInitParam, "BufSize2"), 512);
		var iBufSize3 = this._ParseInt(this._oAtx.omlGetContent(sInitParam, "BufSize3"), 0);
		var iDigest = this._ParseInt(this._oAtx.omlGetContent(sInitParam, "Digest"), 1);
		
		var sNodeCfg = "Type=0;Option=1;SKTBufSize0=" + iBufSize0
			+ ";SKTBufSize1=" + iBufSize1 + ";SKTBufSize2=" + iBufSize2
			+ ";SKTBufSize3=" + iBufSize3 + ";P2PTryTime=" + this._iP2PTryTime;

		// Select server parameters.
		this._sObjSvr = this._sInitSvrName;
		this._sSvrAddr = this._sInitSvrAddr;

		// Config atx node.
		this._oAtx.Control = "Type=1;LogLevel0=1;LogLevel1=1";
		this._oAtx.Node = sNodeCfg;
		this._oAtx.Class = "PG_CLASS_Data:16;PG_CLASS_Video:16;PG_CLASS_Audio:16;PG_CLASS_Live:16;PG_CLASS_File:16";
		this._oAtx.Local = "Addr=0:0:0:127.0.0.1:0:0";
		this._oAtx.Server = "Name=" + this._sObjSvr + ";Addr=" + this._sSvrAddr + ";Digest=" + iDigest;
		if (this._sRelayAddr != "") {
			this._oAtx.Relay = "(Relay0){(Type){0}(Load){0}(Addr){" + this._sRelayAddr + "}}";
		}
		else {
			var iInd = this._sSvrAddr.lastIndexOf(':');
			if (iInd > 0) {
				var sSvrIP = this._sSvrAddr.substring(0, iInd);
				this._oAtx.Relay = "(Relay0){(Type){0}(Load){0}(Addr){" + sSvrIP  + ":443}}";
			}
		}

		// Set node's callback
		this._oAtx.OnExtRequest = eval("_pgLiveMultiCallback.OnExtRequest" + this._iInd);
		this._oAtx.OnReply = eval("_pgLiveMultiCallback.OnReply" + this._iInd);

		// Start atx node.
		if (!this._oAtx.Start(0)) {
			this._OutString("pgLibLiveMultiCapture._NodeStart: Start node failed.");
			return pgErrCode.PG_ERR_System;
		}

		// Login to server.
		var iErr = this._NodeLogin();
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodeStart: login failed.");
			this._NodeStop();
			return iErr;
		}

		this._NodeEnableLANScan();

		this._NodeExternal(sInitParam);

		// Start api service.
		iErr = this._ServiceStart();
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodeStart: service start failed.");
			this._NodeStop();
			return iErr;
		}

		return pgErrCode.PG_ERR_Normal;
	}

	this._NodeStop = function() {
		this._ServiceStop();
		this._NodeLogout();
	}

	this._NodeEnableLANScan = function() {
		// Enable LAN scan.
		var sLabel = this._bSingleMode ? "pgLive" : "pgLiveMulti";
		var sValue = "(Enable){1}(Peer){" + this._oAtx.omlEncode(this._sObjSelf) + "}(Label){" +sLabel + "}";
		var sData = "(Item){1}(Value){" + this._oAtx.omlEncode(sValue) + "}";
		var iErr = this._oAtx.ObjectRequest(this._sObjSvr, 2, sData, "pgLibLiveMultiCapture.EnableLanScan");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodeEnableLANScan: Enable lan scan failed. iErr=" + iErr);
		}
	}
	
	this._NodeExternal = function(sInitParam) {
		var sVal = this._oAtx.omlGetContent(sInitParam, "ReportPeerInfo");
		if (sVal != "") {
			this._bReportPeerInfo = (this._ParseInt(sVal, 0) != 0) ? true : false;
		}
	}

	this._NodeLogin = function() {
		var sVersion = "";
		var sVerTemp = this._oAtx.omlGetContent(this._oAtx.utilCmd("Version", ""), "Version");
		if (sVerTemp.length > 1) {
			sVersion = sVerTemp.substring(1);
		}

		var sParam = "(Ver){" + sVersion + "." + this._LIVE_VER + "}";

		var sData = "(User){" + this._oAtx.omlEncode(this._sObjSelf) + "}(Pass){"
			+ this._oAtx.omlEncode(this._sPass) + "}(Param){" + this._oAtx.omlEncode(sParam) + "}";
		var iErr = this._oAtx.ObjectRequest(this._sObjSvr, 32, sData, "pgLibLiveMultiCapture.Login");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodeLogin: Login failed. iErr=" + iErr);
			return iErr;
		}

		return pgErrCode.PG_ERR_Normal;
	}

	this._NodeLogout = function() {

		if (this._bLogin) {
			this._VideoListForwardRequest(false);
			this._AudioListForwardRequest(false);
		}

		this._oAtx.ObjectRequest(this._sObjSvr, 33, "", "pgLibLiveMultiCapture.Logout");
		if (this._bLogin) {
			this._OnEvent("Logout", "", "");
		}

		this._bLogin = false;
	}

	this._NodeRelogin = function(uDelay) {
		this._NodeLogout();
		this._TimerStart("(Act){Relogin}", uDelay);
	}
	
	this._NodeRedirect = function(sRedirect) {

		this._NodeLogout();

		var sSvrName = this._oAtx.omlGetContent(sRedirect, "SvrName");
		if (sSvrName != "" && sSvrName != this._sObjSvr) {
			this._oAtx.ObjectDelete(this._sObjSvr);
			if (!this._oAtx.ObjectAdd(sSvrName, "PG_CLASS_Peer", "", (0x10000 | 0x2))) {
				this._OutString("pgLibLiveMultiCapture._NodeRedirect: Add server object failed");
				return;
			}
			this._sObjSvr = sSvrName;
			this._sSvrAddr = "";
		}

		var sSvrAddr = this._oAtx.omlGetContent(sRedirect, "SvrAddr");
		if (sSvrAddr != "" && sSvrAddr != this._sSvrAddr) {
			var sData = "(Addr){" + sSvrAddr + "}(Proxy){}";
			var iErr = this._oAtx.ObjectRequest(this._sObjSvr, 37, sData, "pgLibLiveMultiCapture.Redirect");
			if (iErr > 0) {
				this._OutString("pgLibLiveMultiCapture._NodeRedirect: Set server address. iErr=" + iErr);
				return;
			}
			this._sSvrAddr = sSvrAddr;
		}

		this._OutString("pgLibLiveMultiCapture._NodeRedirect: sSvrName=" + sSvrName + ", sSvrAddr=" + sSvrAddr);

		this._TimerStart("(Act){Relogin}", 1);
	}
	
	this._NodeRedirectReset = function(uDelay) {
		if (this._sSvrAddr != this._sInitSvrAddr) {
			var sRedirect = "(SvrName){" + this._sInitSvrName
				+ "}(SvrAddr){" + this._sInitSvrAddr + "}";
			this._NodeRedirect(sRedirect);
		}
		else {
			if (uDelay != 0) {
				this._NodeRelogin(uDelay);
			}
		}
	}

	this._NodeLoginReply = function(uErr, sData) {
		if (uErr != pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodeLoginReply: Login failed. uErr=" + uErr);
			
			this._OnEvent("Login", ("" + uErr), "");

			if (uErr == pgErrCode.PG_ERR_Network
				|| uErr == pgErrCode.PG_ERR_Timeout
				|| uErr == pgErrCode.PG_ERR_Busy)
			{
				this._NodeRedirectReset(10);
			}

			return 1;
		}

		var sParam = this._oAtx.omlGetContent(sData, "Param");
		var sRedirect = this._oAtx.omlGetEle(sParam, "Redirect.", 10, 0);
		if (sRedirect != "") {
			this._NodeRedirect(sRedirect);
			return 1;
		}

		this._bLogin = true;
		
		// Request video forward.
		this._VideoListForwardRequest(true);
		this._AudioListForwardRequest(true);

		this._OnEvent("Login", "0", "");
		return 1;
	}

	this._NodePeerGetInfo = function(sPeer) {
		if (!this._bStarted) {
			return;
		}
	
		var iErr = this._oAtx.ObjectRequest(sPeer, 38, "", "pgLibLiveMultiCapture.PeerGetInfo");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._NodePeerGetInfo: iErr=" + iErr);
		}
	}

	this._InitPrivate = function(sInitParam) {
		var sValue = this._oAtx.omlGetContent(sInitParam, "SingleMode");
		if (sValue != "") {
			var iSingeMode = this._ParseInt(sValue, 0);
			this._bSingleMode = (iSingeMode != 0) ? true : false;
		}
		else {
			this._bSingleMode = false;
		}
	}

	this._ServiceStart = function() {

		// Add group object.
		var sObjGroup = this._GroupBuildObject();
		if (!this._oAtx.ObjectAdd(sObjGroup, "PG_CLASS_Group", "", (0x10000 | 0x10 | 0x4 | 0x1 | 0x40))) {
			this._OutString("pgLibLiveMultiCapture._ServiceStart: Add 'thisGroup' failed.");
			return pgErrCode.PG_ERR_System;
		}

		var uMask = 0x0200; // Tell all.
		var sDataModify = "(Action){1}(PeerList){(" + this._sObjSelf + "){" + uMask + "}}";
		var iErr = this._oAtx.ObjectRequest(sObjGroup, 32, sDataModify, "");

		var iIDTimer = this._TimerStart("(Act){TimerActive}", 10);
		if (iIDTimer < 0) {
			this._oAtx.ObjectDelete(sObjGroup);
			return pgErrCode.PG_ERR_System;
		}

		this._iActiveStamp = 0;

		// Add data object use to transfer message.
		var sObjData = this._DataBuildObject();
		if (!this._oAtx.ObjectAdd(sObjData, "PG_CLASS_Data", sObjGroup, 0x10000)) {
			this._OutString("pgLibLiveMultiCapture._ServiceStart: Add '" + sObjData + "' failed.");
			this._TimerStop(iIDTimer);
			this._oAtx.ObjectDelete(sObjGroup);
			return pgErrCode.PG_ERR_System;
		}

		this._bStarted = true;
		return pgErrCode.PG_ERR_Normal;
	}

	this._ServiceStop = function() {

		this._bStarted = false;

		var iVideoID = 0;
		while (iVideoID < 32) {
			if (this._VideoListExist(iVideoID)) {
				this._ForwardRequest(iVideoID, 1, "", false);
				this._VideoClean(iVideoID, true);
				this._VideoListDelete(iVideoID);
			}
			iVideoID++;
		}

		var iAudioID = 0;
		while (iAudioID < 16) {
			if (this._AudioListExist(iAudioID)) {
				this._AudioClean(iAudioID);
				this._AudioListDelete(iAudioID);
			}
			iAudioID++;
		}
		
		this._FileListClean();

		var sObjGroup = this._GroupBuildObject();
		var sDataModify = "(Action){0}(PeerList){(" + this._oAtx.omlEncode(this._sObjSelf) + "){0}}";
		this._oAtx.ObjectRequest(sObjGroup, 32, sDataModify, "");

		var sObjData = this._DataBuildObject();
		this._oAtx.ObjectDelete(sObjData);

		this._oAtx.ObjectDelete(sObjGroup);
	}

	this._ForwardRequest = function(iMediaID, iType, sParam, bAction) {

		var iErr = pgErrCode.PG_ERR_Normal;
		if (this._bSingleMode) {
			if (iMediaID < 0) {
				return iErr;
			}
		}

		if (bAction) {
			var sData = "";
			if (this._bSingleMode) {
				sData = "2049:(Capture){" + this._sDevID + "}";
			}
			else {
				sData = "2049:(Capture){" + this._sDevID + "}(MID){"
					+ iMediaID + "}(Type){" + iType + "}";
			}

			var sParamReq = "LIVE_FWD_ALLOC:" + sParam;
			iErr = this._oAtx.ObjectRequest(this._sObjSvr, 35, sData, sParamReq);
			if (iErr <= pgErrCode.PG_ERR_Normal) {
				if (iType == 0) {
					this._AudioListSet(iMediaID, "Forward", "1");
				}
				else if (iType == 1) {
					this._VideoListSet(iMediaID, "Forward", "1");
				}
			}
		}
		else {
			var sData = "";
			if (this._bSingleMode) {
				sData = "2050:(Capture){" + this._sDevID + "}";
			}
			else {
				sData = "2050:(Capture){" + this._sDevID + "}(MID){"
					+ iMediaID + "}(Type){" + iType + "}";
			}

			var sParamReq = "LIVE_FWD_FREE:" + sParam;
			iErr = this._oAtx.ObjectRequest(this._sObjSvr, 35, sData, sParamReq);
			if (iErr <= pgErrCode.PG_ERR_Normal) {
				if (iType == 0) {
					this._AudioListSet(iMediaID, "Forward", "0");
				}
				else if (iType == 1) {
					this._VideoListSet(iMediaID, "Forward", "0");
				}
			}
		}

		return iErr;
	}


	//------------------------------------------------------
	// Timer handles.

	this._iActiveStamp = 0;

	this._TimerStart = function(sParam, iTimeout) {
		try {
			this._OutString("pgLibLiveMultiCapture._TimerStart: sParam=" + sParam);
			var sJS = "_pgLiveMultiCallback.OnTimeout" + this._iInd + "('" + sParam + "')";
			return window.setTimeout(sJS, (iTimeout * 1000));
		}
		catch (e) {
			return -1;
		}
	}

	this._TimerStop = function(iTimerID) {
		window.clearTimeout(iTimerID);
	}

	this._TimerActive = function() {
		if (!this._bStarted) {
			this._iActiveStamp = 0;
			return;
		}
	
		this._iActiveStamp += 10;
		this._TimerStart("(Act){TimerActive}", 10);

		// Enum the invalid render peer.
		var sObjPeer = this._oAtx.ObjectEnum(this._sObjRenEnum, "PG_CLASS_Peer");
		if (sObjPeer != ""
			&& sObjPeer != this._sObjSelf
			&& sObjPeer != this._sObjSvr
			&& sObjPeer.indexOf("_LFS_") != 0)
		{
			var sRenID = this._RenderObjectParseRenID(sObjPeer);
			if (this._RenderListSearch(sRenID) == "") {
				if (this._oAtx.ObjectRequest(sObjPeer, 41, "(Check){2}(Value){30}(Option){}",
					"pgLibLiveMultiCapture.CheckFresh") != pgErrCode.PG_ERR_Normal)
				{
					this._oAtx.ObjectDelete(sObjPeer);
					this._OutString("pgLibLiveMultiCapture._TimerActive: Delete trashy peer=" + sObjPeer);
				}
			}
		}
	
		this._sObjRenEnum = sObjPeer;

		if (this._sListRender == "") {
		 	return;
		}

		var iInd = 0;
		while (true) {
			var sEle = this._oAtx.omlGetEle(this._sListRender, "", 1, iInd);
			if (sEle == "") {
				break;
			}
			var sStamp = this._oAtx.omlGetContent(sEle, ".Stamp");
			if ((this._iActiveStamp - this._ParseInt(sStamp, 0)) > 30) {
				var sRenID = this._oAtx.omlGetName(sEle, "");
				this._RenderReject(sRenID, 1);
				continue;
			}
			iInd++;
		}

		iInd = 0;
		while (true) {
			var sEle = this._oAtx.omlGetEle(this._sListRender, "", 1, iInd);
			if (sEle == "") {
				break;
			}

			var sRenID = this._oAtx.omlGetName(sEle, "");
			var sObjRender = this._RenderBuildObject(sRenID);
			this._oAtx.ObjectRequest(sObjRender, 36, "Active?", "pgLibLiveMultiCapture.MessageSend");
			iInd++;
		}
	}


	//------------------------------------------------------
	// Render list handles.

	this._sListRender = "";
	
	this._RenderBuildObject = function(sRenID) {
		return ("_RND_" + sRenID);
	}

	this._RenderObjectIs = function(sObject) {
		return (sObject.indexOf("_RND_") == 0);
	}

	this._RenderObjectParseRenID = function(sObject) {
		if (sObject.indexOf("_RND_") == 0) {
			return sObject.substring(5);
		}
		return "";
	}

	this._RenderListSearch = function(sRenID) {
		var sPath = "\n*" + sRenID;
		return this._oAtx.omlGetEle(this._sListRender, sPath, 1, 0);
	}

	this._RenderListAdd = function(sRenID) {
		if (!this._RenderListSet(sRenID, "Stamp", ("" + this._iActiveStamp))) {
			this._sListRender += "(" + this._oAtx.omlEncode(sRenID) + "){(Stamp){" + this._iActiveStamp + "}}";
			this._OnEvent("RenderJoin", "", sRenID);
		}
	}

	this._RenderListDelete = function(sRenID, iReason) {
		var sRender = this._RenderListSearch(sRenID);
		if (sRender != "") {
			var sPath = "\n*" + sRenID;
			this._sListRender = this._oAtx.omlDeleteEle(this._sListRender, sPath, 1, 0);
			this._OnEvent("RenderLeave", ("reason=" + iReason), sRenID);

			var sObjRender = this._RenderBuildObject(sRenID);
	
			// Leave render from group
			var sObjGroup = this._GroupBuildObject();
			var sDataModify = "(Action){0}(PeerList){(" + this._oAtx.omlEncode(sObjRender) + "){0}}";
			this._oAtx.ObjectRequest(sObjGroup, 32, sDataModify, "");
	
			// Delete render peer object.
			this._oAtx.ObjectDelete(sObjRender);
		}
	}

	this._RenderListSet = function(sRenID, sItem, sValue) {
		var sRender = this._RenderListSearch(sRenID);
		if (sRender != "") {
			var sPath = "\n*" + sRenID + "*" + sItem;
			this._sListRender = this._oAtx.omlSetContent(this._sListRender, sPath, sValue);
			return true;
		}
		return false;
	}

	this._RenderListGet = function(sRenID, sItem) {
		var sPath = "\n*" + sRenID + "*" + sItem;
		return this._oAtx.omlGetContent(this._sListRender, sPath);
	}

	this._RenderListEnum = function(iIndex) {
		var sRender = this._oAtx.omlGetEle(this._sListRender, "", 1, iIndex);
		if (sRender != "") {
			return this._oAtx.omlGetName(sRender, "");
		}
		return "";
	}

	this._RenderReject = function(sRenID, iReason) {
		var sObjGroup = this._GroupBuildObject();
		var sObjRender = this._RenderBuildObject(sRenID);
		var sDataModify = "(Action){0}(PeerList){(" + sObjRender + "){}}";
		var iErr = this._oAtx.ObjectRequest(sObjGroup, 32, sDataModify, "pgLibLiveMultiCapture._RenderReject");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._RenderReject: Render leave group failed. iErr=" + iErr);
		}

		this._FileListDelete(sRenID);
		this._RenderListDelete(sRenID, iReason);
		return pgErrCode.PG_ERR_Normal;
	}


	//------------------------------------------------------
	// Video handles

	this._sListVideo = "";

	this._VideoBuildObject = function(iVideoID) {
		if (this._bSingleMode) {
			return ("thisLive_" + this._sDevID);
		}
		else {
			return ("Live_" + this._sDevID + "_" + iVideoID);
		}
	}

	this._VideoObjectIs = function(sObject) {
		if (this._bSingleMode) {
			return (sObject.indexOf("thisLive_") == 0);
		}
		else {
			return (sObject.indexOf("Live_") == 0);
		}
	}

	this._VideoObjectParseVdieoID = function(sObject) {
		if (this._bSingleMode) {
			return 0;
		}
		else {
			var iInd = sObject.lastIndexOf("_");
			if (iInd > 0) {
				return this._ParseInt(sObject.substring(iInd + 1), -1);
			}
			return -1;
		}
	}

	this._PrvwBuildObject = function(iVideoID) {
		if (this._bSingleMode) {
			return ("thisPrvw");
		}
		else {
			return ("Prvw_" + iVideoID);
		}
	}

	this._VideoListSearch = function(iVideoID) {
		return this._oAtx.omlGetEle(this._sListVideo, ("" + iVideoID), 1, 0);
	}

	this._VideoListAdd = function(iVideoID) {
		var iVideoIDTemp = iVideoID;
		if (this._bSingleMode) {
			iVideoIDTemp = 0;
		}
		var sVideo = this._VideoListSearch(iVideoIDTemp);
		if (sVideo == "") {
			this._sListVideo += "(" + iVideoIDTemp + "){(Forward){0}(Param){}(Wnd){}}";
		}
	}

	this._VideoListDelete = function(iVideoID) {
		var iVideoIDTemp = iVideoID;
		if (this._bSingleMode) {
			iVideoIDTemp = 0;
		}
		var sVideo = this._VideoListSearch(iVideoIDTemp);
		if (sVideo != "") {
			this._sListVideo = this._oAtx.omlDeleteEle(this._sListVideo, ("" + iVideoIDTemp), 1, 0);
			return true;
		}
		return false;
	}

	this._VideoListSet = function(iVideoID, sItem, sValue) {
		var iVideoIDTemp = iVideoID;
		if (this._bSingleMode) {
			iVideoIDTemp = 0;
		}
		var sVideo = this._VideoListSearch(iVideoIDTemp);
		if (sVideo != "") {
			var sPath = "\n*" + iVideoIDTemp + "*" + sItem;
			this._sListVideo = this._oAtx.omlSetContent(this._sListVideo, sPath, sValue);
			return true;
		}
		return false;
	}

	this._VideoListGet = function(iVideoID, sItem) {
		var iVideoIDTemp = iVideoID;
		if (this._bSingleMode) {
			iVideoIDTemp = 0;
		}
		var sPath = "\n*" + iVideoIDTemp + "*" + sItem;
		return this._oAtx.omlGetContent(this._sListVideo, sPath);
	}
	
	this._VideoListExist = function(iVideoID) {
		var iVideoIDTemp = iVideoID;
		if (this._bSingleMode) {
			iVideoIDTemp = 0;
		}
		var sVideo = this._VideoListSearch(iVideoIDTemp);
		return (sVideo != "");
	}

	this._VideoListForwardRequest = function(bAction) {
		var iInd = 0;
		while (true) {
			var sEle = this._oAtx.omlGetEle(this._sListVideo, "", 1, iInd);
			if (sEle == "") {
				break;
			}

			var sVideoID = this._oAtx.omlGetName(sEle, "");
			var sForward = this._oAtx.omlGetContent(sEle, "Forward");
			if (sForward == "1") {
				if (bAction) {
					var sData = "2049:(Capture){" + this._sDevID + "}(VID){" + sVideoID + "}";
					var iErr = this._oAtx.ObjectRequest(this._sObjSvr,
						35, sData, "pgLibLiveMultiCapture.ForwardRequest");
				}
				else {
					var sData = "2050:(Capture){" + this._sDevID + "}(VID){" + sVideoID + "}";
					var iErr = this._oAtx.ObjectRequest(this._sObjSvr,
						35, sData, "pgLibLiveMultiCapture.ForwardRequest");
				}
			}

			iInd++;
		}
	}

	this._VideoPreview = function(iVideoID) {
		var iErr = pgErrCode.PG_ERR_System;
		var sObjPrvw = this._PrvwBuildObject(iVideoID);
		if (this._oAtx.ObjectAdd(sObjPrvw, "PG_CLASS_Video", "", 0x2)) {
			var sParam = this._VideoListGet(iVideoID, "Param");

			var sCameraNo = this._oAtx.omlGetContent(sParam, "CameraNo");
			if (sCameraNo != "") {
				var sDataTemp = "(Item){15}(Value){" + sCameraNo + "}";
				this._oAtx.ObjectRequest(sObjPrvw, 2, sDataTemp, "pgLibLiveMultiCapture.SetCameraNo");
			}

			var iMode = this._ParseInt(this._oAtx.omlGetContent(sParam, "Mode"), 2);
			if (iMode < 2) {
				iMode = 2;
			}
			var iRate = this._ParseInt(this._oAtx.omlGetContent(sParam, "Rate"), 100);
			if (iRate > 100) {
				iRate = 100;
			}

			var sWndEle = this._VideoListGet(iVideoID, "Wnd");
			var sWndRect = "(Code){0}(Mode){" + iMode + "}(Rate){" + iRate + "}(Wnd){" + sWndEle + "}";
			iErr = this._oAtx.ObjectRequest(sObjPrvw, 32, sWndRect, "pgLibLiveMultiCapture._VideoPreview");
			if (iErr > pgErrCode.PG_ERR_Normal) {
				this._oAtx.ObjectDelete(sObjPrvw);
			}
		}

		return iErr;
	}

	this._VideoGetParamItem = function(sParamList, sItem) {
		var iParam = -1;
		var sParam = this._oAtx.omlGetContent(sParamList, sItem);
		if (sParam != "") {
			iParam = this._ParseInt(sParam, -1);
		}
		return iParam;
	}

	this._VideoSelectParamItem = function(sParamListNew, sParamListOld, sItem) {
		var iParamNew = -1;
		var sParamNew = this._oAtx.omlGetContent(sParamListNew, sItem);
		if (sParamNew != "") {
			iParamNew = this._ParseInt(sParamNew, -1);
		}

		var iParamOld = -1;
		var sParamOld = this._oAtx.omlGetContent(sParamListOld, sItem);
		if (sParamOld != "") {
			iParamOld = this._ParseInt(sParamOld, -1);
		}

		if (iParamNew >= 0) {
			return iParamNew;
		}

		if (iParamOld >= 0) {
			return iParamOld;
		}

		return -1;
	}

	this._VideoInit = function(iVideoID, bPreview) {

		var iErr = this._VideoOption(iVideoID, "");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			return iErr;
		}

		if (bPreview) {
			iErr = this._VideoPreview(iVideoID);
			if (iErr > pgErrCode.PG_ERR_Normal) {
				return iErr;
			}
		}

		var iAddFlag = (0x10000 | 0x2 | 0x04 | 0x08);
		var sObjGroup = this._GroupBuildObject();
		var sObjLive = this._VideoBuildObject(iVideoID);
		if (!this._oAtx.ObjectAdd(sObjLive, "PG_CLASS_Live", sObjGroup, iAddFlag)) {
			this._OutString("pgLibLiveMultiCapture._VideoInit: Add live object failed.");
			return pgErrCode.PG_ERR_System;
		}
		
		var sParam = this._VideoListGet(iVideoID, "Param");
		var iMaxStream = this._ParseInt(this._oAtx.omlGetContent(sParam, "MaxStream"), 0);
		var iFrmRate = this._ParseInt(this._oAtx.omlGetContent(sParam, "Rate"), 0);

		var iDelay = 200;
		var sDelay = this._oAtx.omlGetContent(sParam, "Delay");
		if (sDelay != "") {
			iDelay = this._ParseInt(sDelay, 0);
			if (iDelay < 0) {
				iDelay = 0;
			}
		}

		var iCacheSize = 0;
		if (iFrmRate > 0) {
			iCacheSize = (iDelay / iFrmRate) + 40;
		}
		if (iCacheSize < 80) {
			iCacheSize = 80;
		}

		var sData = "(Source){1}(Media){1}(Delay){" + iDelay + "}(CacheSize){" + iCacheSize + "}"
			+ "(MaxPart){1}(TimerVal){1}(Param){" + this._oAtx.omlEncode(sParam) + "}";

		if (iMaxStream == 0) {
			iMaxStream = 2;
		}

		// Set max output stream
		var sData1 = "(Item){0}(Value){" + iMaxStream + "}";
		this._oAtx.ObjectRequest(sObjLive, 2, sData1, "pgLibLiveMultiCapture.RelayNum");

		var sCameraNo = this._oAtx.omlGetContent(sParam, "CameraNo");
		if (sCameraNo != "") {
			var sDataTemp = "(Item){2}(Value){" + sCameraNo + "}";
			this._oAtx.ObjectRequest(sObjLive, 2, sDataTemp, "pgLibLiveMultiCapture.SetCameraNo");
		}

		// Init live object.
		iErr = this._oAtx.ObjectRequest(sObjLive, 32, sData, "pgLibLiveMultiCapture.VideoStart");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._VideoInit: Open live failed. iErr=" + iErr);
			return iErr;
		}

		// Start play live object.
		sData = "(Action){1}(Param){0}";
		iErr = this._oAtx.ObjectRequest(sObjLive, 34, sData, "pgLibLiveMultiCapture.VideoPlay");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._VideoInit: Play live failed. iErr=" + iErr);
			return iErr;
		}

		return pgErrCode.PG_ERR_Normal;
	}

	this._VideoClean = function(iVideoID, bPreview) {
		var sObjLive = this._VideoBuildObject(iVideoID);
		this._oAtx.ObjectRequest(sObjLive, 33, "", "pgLibLiveMultiCapture.VideoStop");
		this._oAtx.ObjectDelete(sObjLive);

		if (bPreview) {
			var sObjPrvw = this._PrvwBuildObject(iVideoID);
			this._oAtx.ObjectRequest(sObjPrvw, 33, "", "pgLibLiveMultiCapture.PrvwStop");
			this._oAtx.ObjectDelete(sObjPrvw);
		}
	}

	this._VideoOption = function(iVideoID, sParam) {
		
		var sVideoParam = sParam;
		if (sVideoParam == "") {
			sVideoParam = this._VideoListGet(iVideoID, "Param");
		}

		if (!this._oAtx.ObjectAdd("_vTemp", "PG_CLASS_Video", "", 0)) {
			return pgErrCode.PG_ERR_System;
		}

		var iBitRate = this._ParseInt(this._oAtx.omlGetContent(sVideoParam, "BitRate"), 0);
		if (iBitRate != 0) {
			var sValue = "(BitRate){" + iBitRate + "}(FrmRate){0}(KeyFrmRate){0}(LossAlloc){0}";
			var sData = "(Item){5}(Value){" + this._oAtx.omlEncode(sValue) + "}";
			this._oAtx.ObjectRequest("_vTemp", 2, sData, "pgLibLiveMultiCapture.VideoOption");
		}

		var iFrmRate = this._ParseInt(this._oAtx.omlGetContent(sVideoParam, "Rate"), 0);
		if (iFrmRate != 0) {
			var sData = "(Item){4}(Value){" + iFrmRate + "}";
			this._oAtx.ObjectRequest("_vTemp", 2, sData, "pgLibLiveMultiCapture.VideoOption");
		}

		var iCameraNo = this._ParseInt(this._oAtx.omlGetContent(sVideoParam, "CameraNo"), -1);
		if (iCameraNo >= 0) {
			var sData = "(Item){0}(Value){" + iCameraNo + "}";
			this._oAtx.ObjectRequest("_vTemp", 2, sData, "pgLibLiveMultiCapture.VideoOption");
		}

		this._oAtx.ObjectDelete("_vTemp");
		return pgErrCode.PG_ERR_Normal;
	}


	//------------------------------------------------------
	// Audio handles.

	this._sListAudio = "";

	this._AudioBuildObject = function(iAudioID) {
		if (this._bSingleMode) {
			return ("thisAudio_" + this._sDevID);
		}
		else {
			return ("Audio_" + this._sDevID + "_" + iAudioID);
		}
	}

	this._AudioObjectIs = function(sObject) {
		if (this._bSingleMode) {
			return (sObject.indexOf("thisAudio_") == 0);
		}
		else {
			return (sObject.indexOf("Audio_") == 0);
		}
	}

	this._AudioObjectParseAudioID = function(sObject) {
		if (this._bSingleMode) {
			return 0;
		}
		else {
			var iInd = sObject.lastIndexOf("_");
			if (iInd > 0) {
				return this._ParseInt(sObject.substring(iInd + 1), -1);
			}
			return -1;
		}
	}

	this._AudioListSearch = function(iAudioID) {
		return this._oAtx.omlGetEle(this._sListAudio, ("" + iAudioID), 1, 0);
	}

	this._AudioListAdd = function(iAudioID) {
		var iAudioIDTemp = iAudioID;
		if (this._bSingleMode) {
			iAudioIDTemp = 0;
		}
		var sAudio = this._AudioListSearch(iAudioIDTemp);
		if (sAudio == "") {
			this._sListAudio += "(" + iAudioIDTemp + "){(Forward){0}(Param){}}";
		}
	}

	this._AudioListDelete = function(iAudioID) {
		var iAudioIDTemp = iAudioID;
		if (this._bSingleMode) {
			iAudioIDTemp = 0;
		}
		var sAudio = this._AudioListSearch(iAudioIDTemp);
		if (sAudio != "") {
			this._sListAudio = this._oAtx.omlDeleteEle(this._sListAudio, ("" + iAudioIDTemp), 1, 0);
			return true;
		}
		return false;
	}

	this._AudioListSet = function(iAudioID, sItem, sValue) {
		var iAudioIDTemp = iAudioID;
		if (this._bSingleMode) {
			iAudioIDTemp = 0;
		}
		var sAudio = this._AudioListSearch(iAudioIDTemp);
		if (sAudio != "") {
			var sPath = "\n*" + iAudioIDTemp + "*" + sItem;
			this._sListAudio = this._oAtx.omlSetContent(this._sListAudio, sPath, sValue);
			return true;
		}
		return false;
	}

	this._AudioListGet = function(iAudioID, sItem) {
		var iAudioIDTemp = iAudioID;
		if (this._bSingleMode) {
			iAudioIDTemp = 0;
		}
		var sPath = "\n*" + iAudioIDTemp + "*" + sItem;
		return this._oAtx.omlGetContent(this._sListAudio, sPath);
	}
	
	this._AudioListExist = function(iAudioID) {
		var iAudioIDTemp = iAudioID;
		if (this._bSingleMode) {
			iAudioIDTemp = 0;
		}
		var sAudio = this._AudioListSearch(iAudioIDTemp);
		return (sAudio != "");
	}

	this._AudioListForwardRequest = function(bAction) {
		var iInd = 0;
		while (true) {
			var sEle = this._oAtx.omlGetEle(this._sListAudio, "", 1, iInd);
			if (sEle == "") {
				break;
			}

			var sAudioID = this._oAtx.omlGetName(sEle, "");
			var sForward = this._oAtx.omlGetContent(sEle, "Forward");
			if (sForward == "1") {
				if (bAction) {
					var sData = "2049:(Capture){" + this._sDevID + "}(AID){" + sAudioID + "}";
					var iErr = this._oAtx.ObjectRequest(this._sObjSvr,
						35, sData, "pgLibLiveMultiCapture.ForwardRequest");
				}
				else {
					var sData = "2050:(Capture){" + this._sDevID + "}(AID){" + sAudioID + "}";
					var iErr = this._oAtx.ObjectRequest(this._sObjSvr,
						35, sData, "pgLibLiveMultiCapture.ForwardRequest");
				}
			}

			iInd++;
		}
	}

	this._AudioInit = function(iAudioID, sParam) {

		var iAddFlag = (0x10000 | 0x01);
		var iReliable = this._ParseInt(this._oAtx.omlGetContent(sParam, "Reliable"), 0);
		if (iReliable != 0) {
			iAddFlag |= 0x10;
		}

		var iMuteInput = this._ParseInt(this._oAtx.omlGetContent(sParam, "MuteInput"), 0);
		if (iMuteInput != 0) {
			iAddFlag |= 0x80;
		}

		var iMuteOutput = this._ParseInt(this._oAtx.omlGetContent(sParam, "MuteOutput"), 0);
		if (iMuteOutput != 0) {
			iAddFlag |= 0x100;
		}

		var sSpeechSelf = this._oAtx.omlGetContent(sParam, "SpeechSelf");
		if (sSpeechSelf != "") {
			var iSpeechSelf = this._ParseInt(sSpeechSelf, 0);
			if (iSpeechSelf == 0) {
				iAddFlag |= 0x20;				
			}
		}

		var sSpeechPeer = this._oAtx.omlGetContent(sParam, "SpeechPeer");
		if (sSpeechPeer != "") {
			var iSpeechPeer = this._ParseInt(sSpeechPeer, 0);
			if (iSpeechPeer == 0) {
				iAddFlag |= 0x40;				
			}
		}

		var sObjGroup = this._GroupBuildObject();
		var sObjAudio = this._AudioBuildObject(iAudioID);
		if (!this._oAtx.ObjectAdd(sObjAudio, "PG_CLASS_Audio", sObjGroup, iAddFlag)) {
			this._OutString("pgLibLiveMultiCapture._AudioInit: Add '" + sObjAudio + "' failed.");
			return pgErrCode.PG_ERR_System;
		}
		
		var sMicNo = this._oAtx.omlGetContent(sParam, "MicNo");
		if (sMicNo != "" && this._ParseInt(sMicNo, -1) >= 0) {
			var sData = "(Item){9}(Value){" + sMicNo + "}";
			var iErr = this._oAtx.ObjectRequest(sObjAudio, 2, sData, "pgLibLiveMultiCapture._AudioSetMicNo");
			if (iErr > pgErrCode.PG_ERR_Normal) {
				this._OutString("pgLibLiveMultiCapture._AudioInit: set mic number. iErr=" + iErr);
			}	
		}

		var sSpeakerNo = this._oAtx.omlGetContent(sParam, "SpeakerNo");
		if (sSpeakerNo != "" && this._ParseInt(sSpeakerNo, -1) >= 0) {
			var sData = "(Item){10}(Value){" + sSpeakerNo + "}";
			var iErr = this._oAtx.ObjectRequest(sObjAudio, 2, sData, "pgLibLiveMultiCapture._AudioSetSpeakerNo");
			if (iErr > pgErrCode.PG_ERR_Normal) {
				this._OutString("pgLibLiveMultiCapture._AudioInit: set speaker number. iErr=" + iErr);
			}	
		}

		var iErr = this._oAtx.ObjectRequest(sObjAudio, 32, "(Code){1}(Mode){0}", "pgLibLiveMultiCapture.AudioOpen");
		if (iErr > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._AudioInit: Open '" + sObjAudio + "' failed. iErr=" + iErr);
			return iErr;
		}

		return iErr;
	}

	this._AudioClean = function(iAudioID) {
		var sObjAudio = this._AudioBuildObject(iAudioID);
		this._oAtx.ObjectRequest(sObjAudio, 33, "", "pgLibLiveMultiCapture.AudioClose");
		this._oAtx.ObjectDelete(sObjAudio);
	}


	//------------------------------------------------------
	// File handles.

	this._sListFile = "";
	
	this._FileBuildObject = function(sRenID) {
		if (this._bSingleMode) {
			return ("File_" + "_RND_" + sRenID);
		}
		else {
			var sObjFile = ("File_" + this._sDevID + "\n" + sRenID);
			if (sObjFile.length > 127) {
				this._OutString("pgLibLiveMultiCapture._FileBuildObject: '" + sObjFile + "' to long !");
			}
			return sObjFile;
		}
	}
	
	this._FileObjectIs = function(sObject) {
		return (sObject.indexOf("File_") == 0);
	}

	this._FileObjectParseRenID = function(sObject) {
		if (this._bSingleMode) {
			if (sObject.indexOf("File_") == 0) {
				// "File_" + "_RND_" + sRenID
				return sObject.substring(10);
			}
			return "";
		}
		else {		
			var sCapRender = "";
			if (sObject.indexOf("File_") == 0) {
				sCapRender = sObject.substring(5);
			}
			var iInd = sCapRender.indexOf("\n");
			if (iInd > 0) {
				return sCapRender.substring(iInd + 1);
			}
			return "";
		}
	}

	this._FileListSearch = function(sRenID) {
		return this._oAtx.omlGetEle(this._sListFile, ("\n*" + sRenID), 1, 0);
	}

	this._FileListAdd = function(sRenID) {
		var sFile = this._FileListSearch(sRenID);
		if (sFile == "") {
			this._sListFile += "(" + this._oAtx.omlEncode(sRenID) + "){(Status){0}(Handle){0}}";
		}

		var sObjFile = this._FileBuildObject(sRenID);
		if (this._oAtx.ObjectGetClass(sObjFile) != "PG_CLASS_File") {
			var sObjRender = this._RenderBuildObject(sRenID);
			if (!this._oAtx.ObjectAdd(sObjFile, "PG_CLASS_File", sObjRender, 0x10000)) {
				this._OutString("pgLibLiveMultiCapture._FileListAdd: Add '" + sObjFile + "' failed!");
			}
		}
	}

	this._FileListDelete = function(sRenID) {
		var sObjFile = this._FileBuildObject(sRenID);

		this._oAtx.ObjectRequest(sObjFile, 35, "", "");
		this._oAtx.ObjectDelete(sObjFile);

		var sFile = this._FileListSearch(sRenID);
		if (sFile != "") {
			this._sListFile = this._oAtx.omlDeleteEle(this._sListFile, ("\n*" + sRenID), 1, 0);
			return true;
		}

		return false;
	}

	this._FileListSet = function(sRenID, sItem, sValue) {
		var sFile = this._FileListSearch(sRenID);
		if (sFile != "") {
			var sPath = "\n*" + sRenID + "*" + sItem;
			this._sListFile = this._oAtx.omlSetContent(this._sListFile, sPath, sValue);
			return true;
		}
		return false;
	}

	this._FileListGet = function(sRenID, sItem) {
		var sPath = "\n*" + sRenID + "*" + sItem;
		return this._oAtx.omlGetContent(this._sListFile, sPath);
	}

	this._FileListClean = function() {
		var sObjFile = "";
		while (true) {
			sObjFile = this._oAtx.ObjectEnum(sObjFile, "PG_CLASS_File");
			if (sObjFile == "") {
				break;
			}
			this._oAtx.ObjectRequest(sObjFile, 35, "", "");
			this._oAtx.ObjectDelete(sObjFile);
		}
		this._sListFile = "";
	}

	this._FileRequest = function(sRenID, sPath, sPeerPath, iMethod) {
		var iStatus = this._ParseInt(this._FileListGet(sRenID, "Status"), 0);
		if (iStatus != 0) {
			return pgErrCode.PG_ERR_Opened;
		}

		var sData = "(Path){" + this._oAtx.omlEncode(sPath) + "}(PeerPath){" 
			+ this._oAtx.omlEncode(sPeerPath) + "}(TimerVal){1}(Offset){0}(Size){0}";

		var sParam = (iMethod == 32 ? "pgLibLiveMultiCapture.FilePutRequest" : "pgLibLiveMultiCapture.FileGetRequest");

		var sObjFile = this._FileBuildObject(sRenID);
		var iErr =  this._oAtx.ObjectRequest(sObjFile, iMethod, sData, sParam);
		if (iErr > pgErrCode.PG_ERR_Normal) {
			return iErr;
		}

		this._FileListSet(sRenID, "Status", "1");
		return iErr;
	}
	
	this._FileReply = function(iErrReply, sRenID, sPath) {

		var sData = "";
		if (iErrReply != pgErrCode.PG_ERR_Normal) {
			this._FileListSet(sRenID, "Status", "0");
		}
		else {
			this._FileListSet(sRenID, "Status", "1");
			sData = "(Path){" + this._oAtx.omlEncode(sPath) + "}(TimerVal){1}";
		}
	
		this._OutString("pgLibLiveMultiCapture._FileReply: iErrReply=" + iErrReply + ", sRenID=" + sRenID + ", sData=" + sData);

		var iHandle = this._ParseInt(this._FileListGet(sRenID, "Handle"), 0);
		if (iHandle == 0) {
			this._FileListSet(sRenID, "Status", "0");
			return pgErrCode.PG_ERR_BadStatus;
		}

		var sObjFile = this._FileBuildObject(sRenID);
		var iErr = this._oAtx.ObjectExtReply(sObjFile, iErrReply, sData, iHandle);
		if (iErr <= pgErrCode.PG_ERR_Normal) {
			this._FileListSet(sRenID, "Handle", "0");
		}
		
		return iErr;
	}

	this._FileCancel = function(sCapID) {

		var sObjFile = this._FileBuildObject(sCapID);
		var iErr = this._oAtx.ObjectRequest(sObjFile, 35, "", "pgLibLiveMultiRender.FileCancel");
		if (iErr <= pgErrCode.PG_ERR_Normal) {
			this._FileListSet(sCapID, "Status", "0");
		}

		return iErr;
	}

	this._AddrToReadable = function(sAddr) {
		try {
			var sAddrSect = sAddr.split(":", 6);
			if (sAddrSect.length < 6) {
				return sAddr;
			}
			
			var sReadable = "";
			if (sAddrSect[0] == "0"
				&& sAddrSect[1] == "0"
				&& sAddrSect[2] == "0"
				&& sAddrSect[3] != "0"
				&& sAddrSect[3] != "1")
			{
				var iIP = parseInt(sAddrSect[3], 16);
				var iIP0 = (iIP >> 24) & 0xff;
				var iIP1 = (iIP >> 16) & 0xff;
				var iIP2 = (iIP >> 8) & 0xff;
				var iIP3 = (iIP & 0xff);
				sReadable = (iIP0 + "." + iIP1 + "." + iIP2 + "." + iIP3 + ":" + sAddrSect[4]);
			}
			else {
				var iIP0 = parseInt(sAddrSect[0], 16);
				var iIP1 = parseInt(sAddrSect[1], 16);
				var iIP2 = parseInt(sAddrSect[2], 16);
				var iIP3 = parseInt(sAddrSect[3], 16);

				var iWord0 = (iIP0 >> 16) & 0xffff;
				var iWord1 = (iIP0 & 0xffff);

				var iWord2 = (iIP1 >> 16) & 0xffff;
				var iWord3 = (iIP1 & 0xffff);

				var iWord4 = (iIP2 >> 16) & 0xffff;
				var iWord5 = (iIP2 & 0xffff);

				var iWord6 = (iIP3 >> 16) & 0xffff;
				var iWord7 = (iIP3 & 0xffff);

				sReadable = ("[" + iWord0.toString(16) + ":" + iWord1.toString(16) + ":" + iWord2.toString(16)
					+ ":" + iWord3.toString(16) + ":" + iWord4.toString(16) + ":" + iWord5.toString(16)
					+ ":" + iWord6.toString(16) + ":" + iWord7.toString(16) + "]:" + sAddrSect[4]);
			}
			
			return sReadable;
		}
		catch (e) {
			return sAddr;
		}
	}


	///------------------------------------------------------------------------
	// OnExtRequest callback process functions.

	this._OnSelfSync = function(sData, sPeer) {
		var sAct = this._oAtx.omlGetContent(sData, "Action");
		if (sAct == "1") {
			if (sPeer == this._sObjSvr) {
				this._TimerStart("(Act){PeerGetInfo}(Peer){" + sPeer + "}", 5);
			}
		}
		else {
			if (sPeer == this._sObjSvr) {
				this._NodeRelogin(10);
			}
		}
	}

	this._OnSelfMessage = function(sData, sPeer) {
		var sCmd = "";
		var sParam = "";
		var iInd = sData.indexOf('?');
		if (iInd > 0) {
			sCmd = sData.substring(0, iInd);
			sParam = sData.substring(iInd + 1);
		}
		else {
			sParam = sData;
		}

		if (sCmd == "Active") {
			if (this._bStarted) {
				var sRenID = this._RenderObjectParseRenID(sPeer);
				this._RenderListSet(sRenID, "Stamp", ("" + this._iActiveStamp));
			}
			return 0;
		}

		if (sCmd == "Msg") {
			var sRenID = this._RenderObjectParseRenID(sPeer);
			this._OnEvent("Message", sParam, sRenID);
			return 0;
		}

		if (sCmd == "FrmPull") {
			var iVideoID = -1;
			if (this._bSingleMode) {
				iVideoID = 0;
			}
			else {
				iVideoID = this._ParseInt(this._oAtx.omlGetContent(sParam, "VideoID"), -1);
			}
			if (this._VideoListExist(iVideoID)) {
				var sData1 = "(Action){4}(Param){1}";
				var sObjLive = this._VideoBuildObject(iVideoID);
				var iErr = this._oAtx.ObjectRequest(sObjLive, 34, sData1, "pgLibLiveMultiCapture.FrmPull");
				if (iErr > pgErrCode.PG_ERR_Normal) {
					this._OutString("pgLibLiveMultiCapture._SelfMessage: frame pull failed. iErr=" + iErr);
				}
			}
			return 0;
		}

		return 0;
	}
	
	this._OnServerMessage = function(sData, sPeer) {
		
		var sCmd = "";
		var sParam = "";
		var iInd = sData.indexOf('?');
		if (iInd > 0) {
			sCmd = sData.substring(0, iInd);
			sParam = sData.substring(iInd + 1);
		}
		else {
			sParam = sData;
		}

		if (sCmd == "UserExtend") {
			this._OnEvent("SvrNotify", sParam, "");
			return 0;
		}

		if (sCmd == "Restart") {
			if (sParam.indexOf("redirect=1") >= 0) {
				this._NodeRedirectReset(3);
			}
			else {
				var iDelay = 3;
				var iInd1 = sParam.indexOf("delay=");
				if (iInd1 >= 0) {
					// Skip the leng of "delay="
					var sValue = sParam.substring(iInd1 + 6);
					var iValue = this._ParseInt(sValue, 3);
					iDelay = (iValue < 3) ? 3 : iValue;
				}
				this._NodeRelogin(iDelay);
			}
			return 0;
		}

		return 0;
	}

	this._OnServerKickOut = function(sData) {
		var sParam = this._oAtx.omlGetContent(sData, "Param");
		this._OnEvent("KickOut", sParam, "");
	}

	this._OnServerError = function(sData, sPeer) {
		var sMeth = this._oAtx.omlGetContent(sData, "Meth");
		if (sMeth == "32") {
			var sError = this._oAtx.omlGetContent(sData, "Error");
			if (sError == ("" + pgErrCode.PG_ERR_NoLogin)) {
				this._NodeRelogin(3);
			}
			else if (sError == ("" + pgErrCode.PG_ERR_Network)
				|| sError == ("" + pgErrCode.PG_ERR_Timeout)
				|| sError == ("" + pgErrCode.PG_ERR_Busy))
			{
				this._NodeRedirectReset(0);
			}
		}

		return 0;
	}

	this._OnServerRelogin = function(sData, sPeer) {
		var sError = this._oAtx.omlGetContent(sData, "ErrCode");
		if (sError == ("" + pgErrCode.PG_ERR_Normal)) {
			var sParam = this._oAtx.omlGetContent(sData, "Param");
			var sRedirect = this._oAtx.omlGetEle(sParam, "Redirect.", 10, 0);
			if (sRedirect != "") {
				this._NodeRedirect(sRedirect);
				return 0;
			}
			
			this._bLogin = true;
			this._OnEvent("Login", "0", "");
		}
		else if (sError == ("" + pgErrCode.PG_ERR_Network)
			|| sError == ("" + pgErrCode.PG_ERR_Timeout)
			|| sError == ("" + pgErrCode.PG_ERR_Busy))
		{
			this._NodeRedirectReset(0);
		}

		return 0;
	}

	this._OnServerSync = function(sData) {
		var sAct = this._oAtx.omlGetContent(sData, "Action");
		if (sAct != "1") {
			this._NodeRelogin(3);
		}
	}

	this._OnPeerSync = function(sObj, sData) {
		var sAct = this._oAtx.omlGetContent(sData, "Action");
		if (sAct == "1") {
			if (this._bReportPeerInfo) {
				this._TimerStart("(Act){PeerGetInfo}(Peer){" + sObj + "}", 5);
			}
		}
	}

	this._OnPeerError = function(sObj, sData) {
		var sMeth = this._oAtx.omlGetContent(sData, "Meth");
		var sError = this._oAtx.omlGetContent(sData, "Error");
		if (sMeth == "34" && sError == ("" + pgErrCode.PG_ERR_BadUser)) {
			var sRenID = this._RenderObjectParseRenID(sObj);
			if (sRenID != "") {
				this._FileListDelete(sRenID);
				this._RenderListDelete(sRenID, 0);
			}
		}
	}

	this._OnGroupUpdate = function(sData) {
		var sAct = this._oAtx.omlGetContent(sData, "Action");
		var sPeerList = this._oAtx.omlGetEle(sData, "PeerList.", 1024, 0);

		this._OutString(sPeerList);

		var iInd = 0;
		while (true) {
			var sEle = this._oAtx.omlGetEle(sPeerList, "", 1, iInd);
			if (sEle == "") {
				break;
			}

			var sPeerTemp = this._oAtx.omlGetName(sEle, "");
			if (sPeerTemp.indexOf("_RND_") == 0) {
				var sRenID = this._RenderObjectParseRenID(sPeerTemp);
				if (sAct == "1") {
					this._RenderListAdd(sRenID);
					this._FileListAdd(sRenID);
				}
				else {
					this._FileListDelete(sRenID);
					this._RenderListDelete(sRenID, 0);
				}
			}

			iInd++;
		}
	}

	this._OnVideoStatus = function(sObject, sData) {
		var iVideoID = this._VideoObjectParseVdieoID(sObject);
		if (iVideoID < 0) {
			return;
		}

		var sBitRate = this._oAtx.omlGetContent(sData, "BitRate");
		var sFrmRate = this._oAtx.omlGetContent(sData, "FrmRate");
		var sFrmPlay = this._oAtx.omlGetContent(sData, "FrmPlay");

		var sDataTemp = "";
		if (this._bSingleMode) {
			sDataTemp = "bitrate=" + sBitRate + "&frmrate=" + sFrmRate + "&frmplay=" + sFrmPlay;
		}
		else {
			sDataTemp = "videoid=" + iVideoID + "&bitrate=" + sBitRate + "&frmrate=" + sFrmRate + "&frmplay=" + sFrmPlay;
		}

		this._OnEvent("VideoStatus", sDataTemp, "");
	}

	this._OnFileRequest = function(sObj, iMethod, sData, iHandle) {
		var sRenID = this._FileObjectParseRenID(sObj);

		if (this._FileListGet(sRenID, "Status") == "1") {
			return pgErrCode.PG_ERR_BadStatus;
		}

		this._FileListSet(sRenID, "Handle", (iHandle + ""));
		this._FileListSet(sRenID, "Status", "1");

		this._OutString("pgLibLiveMultiCapture._OnFileRequest: sData=" + sData);

		var sPeerPath = this._oAtx.omlGetContent(sData, "PeerPath");
		var sParam = "peerpath=" + sPeerPath;

		if (iMethod == 32) {
			this._OnEvent("FilePutRequest", sParam, sRenID);
		}
		else if (iMethod == 33) {
			this._OnEvent("FileGetRequest", sParam, sRenID);
		}

		return -1; // Async reply
	}

	this._OnFileStatus = function(sObj, sData) {
		var sRenID = this._FileObjectParseRenID(sObj);

		var sStatus = this._oAtx.omlGetContent(sData, "Status");
		var iStatus = this._ParseInt(sStatus, -1);
		if (iStatus != 3) {
			var sPath = this._oAtx.omlGetContent(sData, "Path");
			var sReqSize = this._oAtx.omlGetContent(sData, "ReqSize");
			var sCurSize = this._oAtx.omlGetContent(sData, "CurSize");
			var sParam = "path=" + sPath + "&total=" + sReqSize	+ "&position=" + sCurSize;
			this._OnEvent("FileProgress", sParam, sRenID);
		}
		else { // Stop
			this._FileListSet(sRenID, "Status", "0");

			var sPath = this._oAtx.omlGetContent(sData, "Path");
			var sReqSize = this._oAtx.omlGetContent(sData, "ReqSize");
			var sCurSize = this._oAtx.omlGetContent(sData, "CurSize");

			var sParam = "path=" + sPath + "&total=" + sReqSize + "&position=" + sCurSize;
			this._OnEvent("FileProgress", sParam, sRenID);

			var iCurSize = this._ParseInt(sCurSize, 0);
			var iReqSize = this._ParseInt(sReqSize, 0);
			if (iCurSize >= iReqSize && iReqSize > 0) {
				this._OnEvent("FileFinish", sParam, sRenID);
			}
			else {
				this._OnEvent("FileAbort", sParam, sRenID);
			}
		}

		return 0;
	}

	this._OnFileCancel = function(sObj) {
		var sRenID = this._FileObjectParseRenID(sObj);
		if (sRenID == "") {
			return;
		}

		this._FileListSet(sRenID, "Status", "0");
		this._OnEvent("FileAbort", "", sRenID);	
	}
	
	///------------------------------------------------------------------------
	// Node callback functions.
	this._OnExtRequest = function(sObj, uMeth, sData, uHandle, sPeer) {

		if (!this._VideoObjectIs(sObj) && uMeth != 35) {
			this._OutString("pgLibLiveMultiCapture._OnExtRequest: " + sObj + ", " + uMeth + ", " + sData + ", " + sPeer);
		}

		if (this._VideoObjectIs(sObj)) {
			if (uMeth == 35) {
				this._OnVideoStatus(sObj, sData);
			}
			return 0;
		}

		if (this._FileObjectIs(sObj)) {
			if (uMeth == 32) { // put file request
				return this._OnFileRequest(sObj, uMeth, sData, uHandle);
			}

			if (uMeth == 33) { // get file request
				return this._OnFileRequest(sObj, uMeth, sData, uHandle);
			}

			if (uMeth == 34) { // File transfer status report.
				this._OnFileStatus(sObj, sData);
				return 0;
			}

			if (uMeth == 35) { // Cancel file request
				this._OnFileCancel(sObj);
				return 0;
			}

			return 0;
		}

		if (this._GroupObjectIs(sObj)) {
			if (uMeth == 33) {
				this._OnGroupUpdate(sData);
			}
			return 0;
		}

		if (sObj == this._sObjSelf) {
			if (uMeth == 36) {
				if (sPeer == this._sObjSvr) {
					this._OnServerMessage(sData, sPeer);
				}
				else {
					this._OnSelfMessage(sData, sPeer);
				}
			}
			else if (uMeth == 0) {
				this._OnSelfSync(sData, sPeer);
			}
			else if (uMeth == 47) {
				if (sPeer == this._sObjSvr) {
					this._OnServerKickOut(sData);
				}
			}
			return 0;
		}

		if (sObj == this._sObjSvr) {
			if (uMeth == 0) {
				this._OnServerSync(sData);
			}
			else if (uMeth == 1) {
				this._OnServerError(sData, sPeer);
			}
			else if (uMeth == 46) {
				this._OnServerRelogin(sData, sPeer);
			}
			return 0;
		}

		if (this._oAtx.ObjectGetClass(sObj) == "PG_CLASS_Peer") {
			if (uMeth == 0) {
				this._OnPeerSync(sObj, sData);
			}
			else if (uMeth == 1) {
				this._OnPeerError(sObj, sData);
			}
			return 0;
		}

		return 0;
	}

	//------------------------------------------------------
	// OnReply callback process functions.

	this._OnVideoCameraReply = function(sObj, sData) {
		var iVideoID = this._VideoObjectParseVdieoID(sObj);
		if (!this._VideoListExist(iVideoID)) {
			return;
		}

		var sPath = this._oAtx.omlGetContent(sData, "Path");

		if (this._bSingleMode) {
			this._OnEvent("VideoCameraReply", sPath, "");
		}
		else {
			this._OnEvent("VideoCamera", sPath, "");
		}
	}

	this._OnForwardFreeReply = function(iErr, sParam) {
		// "LIVE_FWD_FREE:"
		var sParamTemp = sParam.substring(14);
		this._OnEvent("ForwardFreeReply", (iErr + ""), sParamTemp);
	}

	this._OnForwardAllocReply = function(iErr, sParam) {
		// "LIVE_FWD_ALLOC:"
		var sParamTemp = sParam.substring(15);
		this._OnEvent("ForwardAllocReply", (iErr + ""), sParamTemp);
	}

	this._OnSvrReply = function(iErr, sData, sParam) {
		// "LIVE_SVR_REQ:"
		var sParamTemp = sParam.substring(13);
		if (iErr != pgErrCode.PG_ERR_Normal) {
			this._OnEvent("SvrReplyError", (iErr + ""), sParamTemp);
		}
		else {
			this._OnEvent("SvrReply", sData, sParamTemp);			
		}
	}

	this._OnPeerGetInfoReply = function(sObj, iErr, sData) {
		if (iErr != pgErrCode.PG_ERR_Normal) {
			return;
		}
	
		var sRenID = this._RenderObjectParseRenID(sObj);
		if (sObj != this._sObjSvr) {
			if (this._RenderListSearch(sRenID) == "") {
				return;
			}
		}
		else {
			sRenID = sObj;
		}

		var sThrough = this._oAtx.omlGetContent(sData, "Through");
		var sProxy = this._AddrToReadable(this._oAtx.omlGetContent(sData, "Proxy"));

		var sAddrLcl = this._AddrToReadable(this._oAtx.omlGetContent(sData, "AddrLcl"));

		var sAddrRmt = this._AddrToReadable(this._oAtx.omlGetContent(sData, "AddrRmt"));

		var sTunnelLcl = this._AddrToReadable(this._oAtx.omlGetContent(sData, "TunnelLcl"));

		var sTunnelRmt = this._AddrToReadable(this._oAtx.omlGetContent(sData, "TunnelRmt"));

		var sPrivateRmt = this._AddrToReadable(this._oAtx.omlGetContent(sData, "PrivateRmt"));

		var sDataInfo = "16:(" + this._oAtx.omlEncode(sObj) + "){(Through){" + sThrough + "}(Proxy){"
			+ this._oAtx.omlEncode(sProxy) + "}(AddrLcl){" + this._oAtx.omlEncode(sAddrLcl) + "}(AddrRmt){"
			+ this._oAtx.omlEncode(sAddrRmt) + "}(TunnelLcl){" + this._oAtx.omlEncode(sTunnelLcl) + "}(TunnelRmt){"
			+ this._oAtx.omlEncode(sTunnelRmt) + "}(PrivateRmt){" + this._oAtx.omlEncode(sPrivateRmt) + "}}";

		var iErrTemp = this._oAtx.ObjectRequest(this._sObjSvr, 35, sDataInfo, "pgLibLiveMultiCapture.ReportPeerInfo");
		if (iErrTemp > pgErrCode.PG_ERR_Normal) {
			this._OutString("pgLibLiveMultiCapture._OnPeerGetInfoReply: iErr=" + iErrTemp);
		}

		// Report to app.
		sDataInfo = "peer=" + sRenID + "&through=" + sThrough + "&proxy=" + sProxy
			+ "&addrlcl=" + sAddrLcl + "&addrrmt=" + sAddrRmt + "&tunnellcl=" + sTunnelLcl
			+ "&tunnelrmt=" + sTunnelRmt + "&privatermt=" + sPrivateRmt;
		this._OnEvent("PeerInfo", sDataInfo, sRenID);
	}

	this._OnReply = function(sObj, uErr, sData, sParam) {

		this._OutString("pgLibLiveMultiCapture._OnReply: " + sObj + ", " + uErr + ", " + sData + ", " + sParam);

		if (sObj == this._sObjSvr) {
			if (sParam == "pgLibLiveMultiCapture.Login") {
				this._NodeLoginReply(uErr, sData);
			}
			else if (sParam.indexOf("LIVE_SVR_REQ:") == 0) {
				this._OnSvrReply(uErr, sData, sParam);
			}
			else if (sParam.indexOf("LIVE_FWD_ALLOC:") == 0) {
				this._OnForwardAllocReply(uErr, sParam);	
			}
			else if (sParam.indexOf("LIVE_FWD_FREE:") == 0) {
				this._OnForwardFreeReply(uErr, sParam);
			}
			else if (sParam == "pgLibLiveMultiCapture.PeerGetInfo") {
				this._OnPeerGetInfoReply(sObj, uErr, sData);
			}
			return 1;
		}
		
		if (this._FileObjectIs(sObj)) {
			if (sParam == "pgLibLiveMultiCapture.FileGetRequest"
				|| sParam == "pgLibLiveMultiCapture.FilePutRequest")
			{
				var sRenID = this._FileObjectParseRenID(sObj);
				if (uErr != pgErrCode.PG_ERR_Normal) {
					this._FileListSet(sRenID, "Status", "0");
					this._OnEvent("FileReject", (uErr + ""), sRenID);
					return 1;
				}
				else {
					this._FileListSet(sRenID, "Status", "1");
					this._OnEvent("FileAccept", "0" , sRenID);
					return 1;
				}
			}

			return 1;
		}

		if (this._VideoObjectIs(sObj)) {
			if (sParam == "pgLibLiveMultiCapture.VideoCamera") {
				this._OnVideoCameraReply(sObj, sData);
			}
			
			return 1;
		}

		if (this._RenderObjectIs(sObj)) {
			if (sParam == "pgLibLiveMultiCapture.PeerGetInfo") {
				this._OnPeerGetInfoReply(sObj, uErr, sData);
			}
			return 1;
		}

		return 1;
	}
}


// Live callback.
var _pgLiveMultiCallback = {

	aLiveList:new Array(null, null, null, null),
	
	OnExtRequest0:function(sObj, uMeth, sData, uHandle, sPeer) {
		if (_pgLiveMultiCallback.aLiveList[0]) {
			return _pgLiveMultiCallback.aLiveList[0]._OnExtRequest(sObj, uMeth, sData, uHandle, sPeer);
		}
		return 0;
	},
	OnReply0:function(sObj, uErr, sData, sParam) {
		if (_pgLiveMultiCallback.aLiveList[0]) {
			return _pgLiveMultiCallback.aLiveList[0]._OnReply(sObj, uErr, sData, sParam);
		}
		return 1;
	},
	OnTimer0:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[0]) {
			return _pgLiveMultiCallback.aLiveList[0]._OnTimer(sExec);
		}
		return 1;
	},
	OnTimeout0:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[0]) {
			return _pgLiveMultiCallback.aLiveList[0]._OnTimeout(sExec);
		}
		return 1;
	},
	
	OnExtRequest1:function(sObj, uMeth, sData, uHandle, sPeer) {
		if (_pgLiveMultiCallback.aLiveList[1]) {
			return _pgLiveMultiCallback.aLiveList[1]._OnExtRequest(sObj, uMeth, sData, uHandle, sPeer);
		}
		return 0;
	},
	OnReply1:function(sObj, uErr, sData, sParam) {
		if (_pgLiveMultiCallback.aLiveList[1]) {
			return _pgLiveMultiCallback.aLiveList[1]._OnReply(sObj, uErr, sData, sParam);
		}
		return 1;
	},
	OnTimer1:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[1]) {
			return _pgLiveMultiCallback.aLiveList[1]._OnTimer(sExec);
		}
		return 1;
	},
	OnTimeout1:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[1]) {
			return _pgLiveMultiCallback.aLiveList[1]._OnTimeout(sExec);
		}
		return 1;
	},

	OnExtRequest2:function(sObj, uMeth, sData, uHandle, sPeer) {
		if (_pgLiveMultiCallback.aLiveList[2]) {
			return _pgLiveMultiCallback.aLiveList[2]._OnExtRequest(sObj, uMeth, sData, uHandle, sPeer);
		}
		return 0;
	},
	OnReply2:function(sObj, uErr, sData, sParam) {
		if (_pgLiveMultiCallback.aLiveList[2]) {
			return _pgLiveMultiCallback.aLiveList[2]._OnReply(sObj, uErr, sData, sParam);
		}
		return 1;
	},
	OnTimer2:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[2]) {
			return _pgLiveMultiCallback.aLiveList[2]._OnTimer(sExec);
		}
		return 1;
	},
	OnTimeout2:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[2]) {
			return _pgLiveMultiCallback.aLiveList[2]._OnTimeout(sExec);
		}
		return 1;
	},

	OnExtRequest3:function(sObj, uMeth, sData, uHandle, sPeer) {
		if (_pgLiveMultiCallback.aLiveList[3]) {
			return _pgLiveMultiCallback.aLiveList[3]._OnExtRequest(sObj, uMeth, sData, uHandle, sPeer);
		}
		return 0;
	},
	OnReply3:function(sObj, uErr, sData, sParam) {
		if (_pgLiveMultiCallback.aLiveList[3]) {
			return _pgLiveMultiCallback.aLiveList[3]._OnReply(sObj, uErr, sData, sParam);
		}
		return 1;
	},
	OnTimer3:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[3]) {
			return _pgLiveMultiCallback.aLiveList[3]._OnTimer(sExec);
		}
		return 1;
	},
	OnTimeout3:function(sExec) {
		if (_pgLiveMultiCallback.aLiveList[3]) {
			return _pgLiveMultiCallback.aLiveList[3]._OnTimeout(sExec);
		}
		return 1;
	}
};
