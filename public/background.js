// =============================================================================================================

let accessToken = "";

chrome.cookies.get(
  {
    url: "https://www.linkedin.com",
    name: "atk",
  },
  function (cookie) {
    if (cookie) {
      accessToken = cookie.value;
    } else {
      console.log("Cookie not found");
    }
  }
);

let profileDetails = {};

const clickAndExtractProfileDetails = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

  const clickProfile = () => {
    const profileLink = document.querySelector(
      ".feed-identity-module__actor-meta a"
    );
    const profileLinkTwo = document.querySelector(
      `div.artdeco-card.pb4.mb2.overflow-hidden a[href*="/in/"]`
    );

    if (profileLink) {
      profileLink.click();
      return "Success";
    } else if (profileLinkTwo) {
      profileLinkTwo.click();
      return "Success";
    } else {
      return "Profile link not found";
    }
  };

  const extractUsersLinkedinData = () => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        window.scrollTo(0, document.body.scrollHeight);
        setTimeout(() => {
          const countryElement = document.querySelector(
            ".mt2.relative span.text-body-small.inline.t-black--light.break-words"
          );
          const profileNameElement = document.querySelector(
            ".mt2.relative .text-heading-xlarge.inline.t-24.v-align-middle.break-words"
          );
          const anchorElement = document.getElementById(
            "navigation-index-see-all-resources"
          );

          const imageElement = document.querySelector(
            ".pv-top-card__photo-wrapper .profile-photo-edit__edit-btn img"
          );

          const followersCount = document
            .querySelector('a[href="https://www.linkedin.com/feed/followers/"]')
            .querySelector("strong").textContent;

          if (
            countryElement &&
            profileNameElement &&
            anchorElement &&
            followersCount
          ) {
            const href = anchorElement.getAttribute("href");
            let profileIdList = [];

            if (href && href.includes("fsd_profile")) {
              const params = href.split("?")[1];
              const keyValuePairs = params.split("&");
              for (let i = 0; i < keyValuePairs.length; i++) {
                const pair = keyValuePairs[i].split("=");
                if (pair[0] === "profileUrn") {
                  const fsdProfileValue = decodeURIComponent(pair[1]);
                  profileIdList = fsdProfileValue.split(":");
                }
              }
            }

            const locationList = countryElement.textContent.trim().split(", ");
            const countryText = locationList[locationList.length - 1];
            const profileName = profileNameElement.textContent;
            const profileId = profileIdList[profileIdList.length - 1];
            const imageElementSrc = imageElement
              ? imageElement.src
              : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

            const profileDetailsObj = {
              profileId: profileId,
              name: profileName,
              profileUrl: imageElementSrc,
              country: countryText,
              isSignedIn: true,
              followersCount,
            };

            resolve(profileDetailsObj);
          } else {
            reject(new Error("Profile Elements not found"));
          }
        }, 1500);
      }, 1500);
    });
  };

  const clickResult = clickProfile();

  if (clickResult === "Success") {
    try {
      const userDetails = await extractUsersLinkedinData();
      return userDetails;
    } catch (error) {
      console.error("Error extracting user details:", error);
      return null;
    }
  } else {
    return null;
  }
};

const chromeScriptingFunction = (firstTab, callback) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: firstTab.id },
      func: clickAndExtractProfileDetails,
    },
    (value) => {
      profileDetails = value[0].result;
      chrome.storage.local.set({
        storedActivePage: "SIGNEDIN",
        storedProfileDetails: profileDetails,
      });

      callback(profileDetails);
      chrome.tabs.remove(firstTab.id);
    }
  );
};

const checkTabsUrl = (sendResponse) => {
  chrome.tabs.query({}, function (tabs) {
    if (tabs.length > 0) {
      const firstTab = tabs[0];
      const tabUrl = new URL(firstTab.url);
      const tabUrlWithPath = tabUrl.origin + tabUrl.pathname;

      if (
        tabUrlWithPath === "https://www.linkedin.com/" ||
        tabUrlWithPath === "https://www.linkedin.com/home"
      ) {
        profileDetails = { isSignedIn: false };

        chrome.storage.local.set({
          storedActivePage: "SIGNEDOUT",
          storedProfileDetails: profileDetails,
        });
        sendResponse(profileDetails);
      } else if (tabUrlWithPath === "https://www.linkedin.com/feed/") {
        chromeScriptingFunction(firstTab, sendResponse);
      } else {
        chrome.tabs.create(
          { url: "https://www.linkedin.com", active: false, index: 0 },
          function (newTab) {
            chrome.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo
            ) {
              if (tabId === newTab.id && changeInfo.status === "complete") {
                chrome.tabs.get(tabId, function (tabInfo) {
                  if (
                    tabInfo.url === "https://www.linkedin.com/" ||
                    tabInfo.url === "https://www.linkedin.com/home"
                  ) {
                    profileDetails = { isSignedIn: false };

                    chrome.storage.local.set({
                      storedActivePage: "SIGNEDOUT",
                      storedProfileDetails: profileDetails,
                    });
                    sendResponse(profileDetails);
                  } else if (tabInfo.url === "https://www.linkedin.com/feed/") {
                    chromeScriptingFunction(newTab, sendResponse);
                  }
                  // Remove the listener to prevent it from being triggered again
                  chrome.tabs.onUpdated.removeListener(listener);
                });
              }
            });
          }
        );
      }
    } else {
      console.log("No tabs found at index 0");
      sendResponse(null);
    }
  });
};

// ===========================================================================================
// RECEIVE MESSAGE

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "startGettingProfile") {
    checkTabsUrl(sendResponse);
    return true;
  }
});

// ===============================================================================================================

// Follow Users Code Starts
function updateTabUrlToUserProfile(tabId, url) {
  chrome.tabs.update(tabId, { url: url });
}

async function clickFollowBtn() {
  let isFollowed = false;
  const followBtnElement = document.querySelector(
    'button.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view.pvs-profile-actions__action[aria-label^="Follow"]'
  );
  const followBtnOutlineElement = document.querySelector(
    'button.artdeco-button.artdeco-button--2.artdeco-button--secondary.ember-view.pvs-profile-actions__action[aria-label^="Follow"]'
  );
  const followBtnInOptionsElement = document.querySelector(
    'div.artdeco-dropdown__item.artdeco-dropdown__item--is-dropdown.ember-view.full-width.display-flex.align-items-center[aria-label^="Follow"]'
  );

  if (followBtnElement) {
    followBtnElement.click();
    isFollowed = true;
  } else if (followBtnOutlineElement) {
    followBtnOutlineElement.click();
    isFollowed = true;
  } else if (followBtnInOptionsElement) {
    document
      .querySelectorAll("button.pvs-profile-actions__action")
      .forEach(async (moreButton) => {
        if (
          moreButton.querySelector("span") &&
          moreButton.querySelector("span").textContent.trim() === "More"
        ) {
          moreButton.click();

          await new Promise((resolve) => {
            setTimeout(() => {
              resolve();
            }, 1500);
          });

          followBtnInOptionsElement.click();
          isFollowed = true;
        }
      });
  }

  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 1500);
  });

  return isFollowed;
}

function getTabUrl(tabId) {
  return new Promise((resolve, reject) => {
    chrome.tabs.get(tabId, function (tab) {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError.message);
      } else {
        resolve(tab.url);
      }
    });
  });
}

async function startFollowUsers(tabId, usersList) {
  try {
    for (let userIndex in usersList) {
      const profileUrl = `https://www.linkedin.com/in/${usersList[userIndex].toFollowLinkedinId}`;

      updateTabUrlToUserProfile(tabId, profileUrl);

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 15000);
      });

      let userNotFoundUrl = await getTabUrl(tabId);

      if (userNotFoundUrl === "https://www.linkedin.com/404/") {
        console.log("User Banned");
        continue;
      }

      chrome.scripting.executeScript(
        {
          target: { tabId: tabId },
          func: clickFollowBtn,
        },
        async (results) => {
          if (chrome.runtime.lastError) {
            console.error(chrome.runtime.lastError.message);
          } else if (results && results[0] && results[0].result === true) {
            const apiUrl = `http://52.72.128.87:3000/api/mutual/updatefollowstatus`;
            const followItemId = {
              followListItemId: usersList[userIndex].id,
            };
            const options = {
              method: "POST",
              headers: {
                Authorization: `Bearer ${accessToken}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify(followItemId),
            };

            try {
              const response = await fetch(apiUrl, options);
              const data = await response.json();
            } catch (error) {
              console.error("Error in API call", error);
            }
          } else {
            console.log(
              "Follow button was not clicked or result was false",
              results
            );
          }
        }
      );

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 15000);
      });
    }

    chrome.tabs.remove(tabId);
  } catch (error) {
    console.log(error);
  }
}
// Follow Users Code End

function initiateStartFollowUsers(followerList) {
  chrome.tabs.query(
    { url: "https://www.linkedin.com/*" },
    async function (tabs) {
      if (tabs.length > 0) {
        await startFollowUsers(tabs[0].id, followerList);
      } else {
        chrome.tabs.create(
          { url: "https://www.linkedin.com", active: false, index: 0 },
          async function (newTab) {
            await startFollowUsers(newTab.id, followerList);
          }
        );
      }
    }
  );
}

function formatFollowersList(followerList) {
  const formattedFollowerList = followerList.map((eachFollowers) => ({
    id: eachFollowers.id,
    toFollowLinkedinId: eachFollowers.toFollowLinkedin,
  }));

  return formattedFollowerList;
}

async function getFollowerListFromDB() {
  // GET DATA FROM SERVER and START FOLLOWING
  try {
    const apiUrl = "http://52.72.128.87:3000/api/mutual/tofollowerslist";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(apiUrl, options);
    const data = await response.json();
    console.log("No. Of Users", data.length);

    if (response.ok === true && data.length > 0) {
      const formattedFollowerList = formatFollowersList(data);
      initiateStartFollowUsers(formattedFollowerList);
      console.log("Initiated Following");
    }
  } catch (error) {
    console.log(error);
  }
}

// POST ON LINKEDIN
const initiatePostOnLinkedIn = async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 2000);
  });

  const startPostBtn = document.querySelector(
    "button.share-box-feed-entry__trigger"
  );
  if (startPostBtn) {
    startPostBtn.click();

    await new Promise((resolve) => {
      setTimeout(() => {
        resolve();
      }, 2000);
    });

    const postTextArea = document.querySelector("div.ql-editor.ql-blank");

    if (postTextArea) {
      postTextArea.textContent = `🚀 Grow your followers through organic mutual following 🚀

I've been using this awesome Chrome extension for sometime that automatically adds followers and makes us mutually follow them. It's been a total game-changer for my growth on LinkedIn! 🌟

🔹 Auto Follow-Backs: Save time and grow your connections effortlessly.
🔹 Super Secure: Your data and privacy are safe.
🔹 Easy to Use: Simple to install and start using.

I've had amazing results and highly recommend checking it out. Let's grow our networks together! 

https://chromewebstore.google.com/detail/linkedin-follower-grower/lnnpmjffjejpmdjfeaheifpnnidnfkkd

#Networking #TechTools #ProfessionalGrowth #ChromeExtension #Efficiency #Automation #LinkedInTips
`;

      await new Promise((resolve) => {
        setTimeout(() => {
          resolve();
        }, 2000);
      });

      const postBtnSpan = document.querySelector(
        "button.share-actions__primary-action span"
      );

      if (postBtnSpan && postBtnSpan.textContent.trim() === "Post") {
        const postBtn = postBtnSpan.closest(
          "button.share-actions__primary-action"
        );
        postBtn.click();
      }
    }
  }
};

const postContentOnLinkedIn = (firstTab, callback) => {
  chrome.scripting.executeScript(
    {
      target: { tabId: firstTab.id },
      func: initiatePostOnLinkedIn,
    },
    async () => {
      try {
        const options = {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        };

        const response = await fetch(
          "http://52.72.128.87:3000/api/user/updatepostcount",
          options
        );
        const data = await response.json();
      } catch (e) {
        console.log(e.message);
      }
    }
  );
};

const checkTabsToPostContentOnLinkedIn = (sendResponse) => {
  chrome.tabs.query({}, function (tabs) {
    if (tabs.length > 0) {
      const firstTab = tabs[0];
      const tabUrl = new URL(firstTab.url);
      const tabUrlWithPath = tabUrl.origin + tabUrl.pathname;

      if (
        tabUrlWithPath === "https://www.linkedin.com/" ||
        tabUrlWithPath === "https://www.linkedin.com/home"
      ) {
      } else if (tabUrlWithPath === "https://www.linkedin.com/feed/") {
        postContentOnLinkedIn(firstTab, sendResponse);
      } else {
        chrome.tabs.create(
          { url: "https://www.linkedin.com", active: false, index: 0 },
          function (newTab) {
            chrome.tabs.onUpdated.addListener(function listener(
              tabId,
              changeInfo
            ) {
              if (tabId === newTab.id && changeInfo.status === "complete") {
                chrome.tabs.get(tabId, function (tabInfo) {
                  if (
                    tabInfo.url === "https://www.linkedin.com/" ||
                    tabInfo.url === "https://www.linkedin.com/home"
                  ) {
                    console.log("Signed Out");
                  } else if (tabInfo.url === "https://www.linkedin.com/feed/") {
                    postContentOnLinkedIn(newTab, sendResponse);
                  }
                  chrome.tabs.onUpdated.removeListener(listener);
                });
              }
            });
          }
        );
      }
    } else {
      console.log("No tabs found at index 0");
      sendResponse(null);
    }
  });
};

async function getPostPermissionFromDB() {
  try {
    const apiUrl = "http://52.72.128.87:3000/api/user/permissionstatus";
    const options = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    };

    const response = await fetch(apiUrl, options);

    if (response.ok === true) {
      const data = await response.json();

      const formattedPermissionData = {
        allowDm: data.allow_dm,
        allowPosting: data.allow_posting,
        postCount: data.post_count,
      };

      if (
        formattedPermissionData.allowPosting === true &&
        formattedPermissionData.postCount < 1
      ) {
        checkTabsToPostContentOnLinkedIn();
      }
    }
  } catch (error) {
    console.log(error);
  }
}

async function followEveryThirtyMinutes() {
  await getPostPermissionFromDB();
  console.log("Finished Posting (if allowed) and started Following");
  await getFollowerListFromDB();
}

chrome.runtime.onInstalled.addListener(async (details) => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

  console.log("Updated...");

  if (details.reason === "install" || details.reason === "update") {
    chrome.alarms.create("getDataAndFollow", {
      periodInMinutes: 10,
    });
  }
});

chrome.runtime.onStartup.addListener(async () => {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, 5000);
  });

  console.log("Started...");
  chrome.alarms.create("getDataAndFollow", {
    periodInMinutes: 10,
  });
});

// Listener for when the alarm goes off
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === "getDataAndFollow") {
    console.log("FOLLOW TRIGGGERED");
    followEveryThirtyMinutes();
  }
});
