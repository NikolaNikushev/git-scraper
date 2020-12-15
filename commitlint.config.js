module.exports = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        "type-enum": [
            2,
            "always",
            [
                "feat",
                "feature",
                "fix",
                "chore",
                "docs",
                "style",
                "refactor",
                "perf",
                "breaking",
                "revert",
                "build",
                "internal",
                "ci",
                "test",
                "commit"
            ]
        ],
        "subject-case": [
            2,
            "never",
            [
                "start-case",
                "pascal-case"
            ]
        ]
    }
};
