package com.passwordvault.backend.util;

import java.security.SecureRandom;

public class PasswordGeneratorUtil {

    private static final String UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    private static final String LOWER = "abcdefghijklmnopqrstuvwxyz";
    private static final String NUMBERS = "0123456789";
    private static final String SPECIAL = "!@#$%^&*()_+-=[]{}|;:,.<>?";

    private static final String ALL = UPPER + LOWER + NUMBERS + SPECIAL;

    public static String generatePassword(int length) {

        SecureRandom random = new SecureRandom();

        StringBuilder password = new StringBuilder();

        for (int i = 0; i < length; i++) {

            int index = random.nextInt(ALL.length());

            password.append(ALL.charAt(index));

        }

        return password.toString();

    }

}