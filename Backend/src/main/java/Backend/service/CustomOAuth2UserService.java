package Backend.service;

import Backend.model.User;
import Backend.repository.UserRepository;
import Backend.security.OAuth2UserInfo;
import Backend.security.OAuth2UserInfoFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.InternalAuthenticationServiceException;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;

import java.util.Optional;

@Service
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest oAuth2UserRequest) throws OAuth2AuthenticationException {
        OAuth2User oAuth2User = super.loadUser(oAuth2UserRequest);

        try {
            return processOAuth2User(oAuth2UserRequest, oAuth2User);
        } catch (Exception ex) {
            throw new InternalAuthenticationServiceException(ex.getMessage(), ex.getCause());
        }
    }

    private OAuth2User processOAuth2User(OAuth2UserRequest oAuth2UserRequest, OAuth2User oAuth2User) {
        String registrationId = oAuth2UserRequest.getClientRegistration().getRegistrationId();
        OAuth2UserInfo oAuth2UserInfo = OAuth2UserInfoFactory.getOAuth2UserInfo(registrationId, oAuth2User.getAttributes());
        
        if(!StringUtils.hasText(oAuth2UserInfo.getEmail())) {
            throw new OAuth2AuthenticationException("Email not found from OAuth2 provider");
        }

        Optional<User> userOptional = userRepository.findByEmail(oAuth2UserInfo.getEmail());
        User user;

        if(userOptional.isPresent()) {
            user = userOptional.get();
            // Update existing user data only if it was originally created via OAuth
            if ("local".equals(user.getProvider())) {
                // For local users, don't override their profile picture or other info
                // Just update provider details for future logins
                updateLocalUserWithOAuthInfo(user, oAuth2UserRequest.getClientRegistration().getRegistrationId(), oAuth2UserInfo.getId());
            } else {
                // For OAuth-created users, update with provider data
                updateExistingUser(user, oAuth2UserInfo);
            }
        } else {
            // Register new user with OAuth data
            user = registerNewUser(oAuth2UserRequest, oAuth2UserInfo);
        }

        return new org.springframework.security.oauth2.core.user.DefaultOAuth2User(
            null,
            oAuth2User.getAttributes(),
            oAuth2UserRequest.getClientRegistration().getProviderDetails().getUserInfoEndpoint().getUserNameAttributeName()
        );
    }

    private User registerNewUser(OAuth2UserRequest oAuth2UserRequest, OAuth2UserInfo oAuth2UserInfo) {
        User user = new User();

        user.setProvider(oAuth2UserRequest.getClientRegistration().getRegistrationId());
        user.setProviderId(oAuth2UserInfo.getId());
        user.setUsername(oAuth2UserInfo.getName().replaceAll("\\s+", "") + "_" + System.currentTimeMillis());
        user.setEmail(oAuth2UserInfo.getEmail());
        user.setFirstName(oAuth2UserInfo.getName().split(" ")[0]);
        if (oAuth2UserInfo.getName().split(" ").length > 1) {
            user.setLastName(oAuth2UserInfo.getName().split(" ")[1]);
        }
        user.setProfilePicture(oAuth2UserInfo.getImageUrl());
        user.setEnabled(true);
        
        return userRepository.save(user);
    }

    private void updateExistingUser(User existingUser, OAuth2UserInfo oAuth2UserInfo) {
        // Only update profile picture if the user was created via OAuth (not local)
        if (!"local".equals(existingUser.getProvider())) {
            existingUser.setProfilePicture(oAuth2UserInfo.getImageUrl());
        }
        userRepository.save(existingUser);
    }
    
    private void updateLocalUserWithOAuthInfo(User existingUser, String provider, String providerId) {
        // For local users, just update provider info, but keep the provider as "local"
        // This indicates they registered locally but also have used OAuth
        existingUser.setProviderId(providerId);
        userRepository.save(existingUser);
    }
}